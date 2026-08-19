(function () {
  console.log("Folder colour JS v16 is running");

  const TINT_AMOUNT = 0.14;

  let folderTree = null;
  let scanTimer = null;
  let observer = null;

  function getTint(hex) {
    hex = hex.replace("#", "");

    if (hex.length === 3) {
      hex = hex.split("").map(c => c + c).join("");
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    if ([r, g, b].some(Number.isNaN)) {
      return null;
    }

    const nr = Math.round(255 - (255 - r) * TINT_AMOUNT);
    const ng = Math.round(255 - (255 - g) * TINT_AMOUNT);
    const nb = Math.round(255 - (255 - b) * TINT_AMOUNT);

    return `rgb(${nr}, ${ng}, ${nb})`;
  }


  function colourRow(row) {

    const icon = row.querySelector(
      ":scope > .container > .icon"
    );

    const container = row.querySelector(
      ":scope > .container"
    );

    if (!icon || !container) {
      return false;
    }

    /*
     * IMPORTANT:
     * Only use the colour explicitly belonging
     * to THIS folder's icon.
     *
     * We do not inherit anything from parent folders.
     */
    const colour =
      icon.style.getPropertyValue("--icon-color").trim();

    if (!colour) {
      container.style.removeProperty("background-color");
      return false;
    }

    const background = getTint(colour);

    if (!background) {
      container.style.removeProperty("background-color");
      return false;
    }

    container.style.setProperty(
      "background-color",
      background,
      "important"
    );

    return true;
  }


  function scanTree() {

    if (!folderTree) {
      return;
    }

    const rows = [
      ...folderTree.querySelectorAll(
        'li[is="folder-tree-row"]'
      )
    ];

    let coloured = 0;

    rows.forEach(row => {
      if (colourRow(row)) {
        coloured++;
      }
    });

    console.log(
      "Folder scan:",
      rows.length,
      "rows,",
      coloured,
      "coloured"
    );
  }


  function startObserver() {

    if (!folderTree || observer) {
      return;
    }

    observer = new MutationObserver(function () {
      scanTree();
    });

    observer.observe(folderTree, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        "style",
        "class"
      ]
    });

    console.log(
      "Folder MutationObserver started"
    );
  }


  /*
   * Find Thunderbird's 3-pane browser.
   */
  const browser = document.querySelector(
    "#mail3PaneTabBrowser1"
  );

  if (!browser) {
    console.log(
      "mail3PaneTabBrowser1 NOT FOUND"
    );
    return;
  }

  console.log(
    "mail3PaneTabBrowser1 FOUND"
  );


  const win = browser.contentWindow;

  if (!win) {
    console.log(
      "contentWindow NOT FOUND"
    );
    return;
  }


  const doc = win.document;

  console.log(
    "about:3pane document:",
    doc.URL
  );


  /*
   * The folder tree exists in about:3pane,
   * but Thunderbird may populate it asynchronously.
   */
  function findFolderTree() {

    const tree = doc.querySelector(
      "#folderTree"
    );

    if (!tree) {
      return false;
    }

    if (folderTree === tree) {
      return true;
    }

    folderTree = tree;

    console.log(
      "folderTree FOUND"
    );

    console.log(
      "tag =",
      folderTree.tagName
    );

    console.log(
      "id =",
      folderTree.id
    );

    console.log(
      "children initially =",
      folderTree.children.length
    );

    /*
     * First scan.
     */
    scanTree();

    /*
     * Watch Thunderbird populate/rebuild
     * the folder tree.
     */
    startObserver();

    return true;
  }


  /*
   * Try immediately.
   */
  findFolderTree();


  /*
   * Thunderbird can create/populate the folder
   * tree after the userChrome script has run.
   *
   * Therefore retry for a short period.
   */
  let attempts = 0;

  const finder = setInterval(function () {

    attempts++;

    if (findFolderTree()) {
      clearInterval(finder);

      /*
       * Continue scanning periodically because
       * Thunderbird sometimes replaces folder rows
       * without producing the mutation we need.
       */
      if (!scanTimer) {

        scanTimer = setInterval(
          scanTree,
          1000
        );

        console.log(
          "Automatic folder scan started"
        );
      }

      return;
    }

    if (attempts >= 30) {

      clearInterval(finder);

      console.log(
        "Could not find folderTree after 30 attempts"
      );
    }

  }, 500);


  /*
   * Also handle the situation where Thunderbird
   * replaces the folder tree itself.
   */
  setInterval(function () {

    const currentTree = doc.querySelector(
      "#folderTree"
    );

    if (
      currentTree &&
      currentTree !== folderTree
    ) {

      console.log(
        "Folder tree replaced - reconnecting"
      );

      if (observer) {
        observer.disconnect();
        observer = null;
      }

      folderTree = currentTree;

      scanTree();
      startObserver();
    }

  }, 2000);


  console.log(
    "Folder colour JS v16 initialisation complete"
  );

})();