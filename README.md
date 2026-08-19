# thunderbird-folder-colours
Give Thunderbird folder rows a subtle background tint based on each folder's own icon colour.
## Example
Folders with a custom icon colour are given a subtle matching background tint:
![Thunderbird folder colour example](Screenshote for thunderbird-folder-colours.png)
What it does

Thunderbird allows individual mail folders to have a custom icon colour. However, the folder pane normally displays the coloured icon while leaving the folder row background unchanged.

This userChrome.js script uses the colour already assigned to each folder icon and applies a light tint to that folder's background.

For example:

Folder icon	Folder background
🔴 Red	Light red
🔵 Blue	Light blue
🟢 Green	Light green
🟣 Purple	Light purple
No custom colour	Unchanged
Important behaviour

The colour is taken only from the folder's own icon.

A coloured parent folder does not cause its child folders to inherit that colour.

So this:

🔴 Projects
   ├── Project A
   ├── Project B
   └── 🔵 Project C

produces:

🔴 light-red Projects
   ├── Project A          normal
   ├── Project B          normal
   └── 🔵 light-blue Project C
Requirements
Thunderbird 153.0.3 tested
A working userChrome.js installation
Thunderbird's folder icons must expose their colour as --icon-color

This script was developed and tested against Thunderbird's 153.x about:3pane folder-tree implementation.

Warning: userChrome.js is an unsupported Thunderbird customisation mechanism. Thunderbird's developers explicitly warn that changes to the UI's HTML, CSS and JavaScript can cause userChrome customisations to stop working after Thunderbird updates.

Therefore, consider this script version-sensitive rather than assuming it will work indefinitely.

Installation
1. Make sure userChrome.js is being loaded

This script requires a mechanism for loading:

chrome/userChrome.js

One option is the userChromeJS Thunderbird add-on.

The current userChromeJS listing describes it as loading chrome/userChrome.js whenever a Thunderbird window is opened. Its current version is 1.2.2.

userChromeJS on Thunderbird Add-ons

Check the add-on's current compatibility before installing, particularly after a major Thunderbird release.

2. Find your Thunderbird profile

In Thunderbird:

≡ → Help → More Troubleshooting Information

Find Profile Folder and click Open Folder.

Inside the profile, create a directory called:

chrome

You should end up with:

Thunderbird profile/
└── chrome/
    └── userChrome.js

If you already have a userChrome.js, make a backup before replacing it.
