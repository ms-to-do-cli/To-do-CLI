Microsoft To Do CLI
=================

An unofficial CLI-application for the Microsoft To Do

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g microsoft-to-do-cli
$ td COMMAND
running command...
$ td (--version)
microsoft-to-do-cli/1.5.0 win32-x64 node-v16.13.0
$ td --help [COMMAND]
USAGE
  $ td COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`td help [COMMAND]`](#td-help-command)
* [`td plugins`](#td-plugins)
* [`td plugins:install PLUGIN...`](#td-pluginsinstall-plugin)
* [`td plugins:inspect PLUGIN...`](#td-pluginsinspect-plugin)
* [`td plugins:install PLUGIN...`](#td-pluginsinstall-plugin-1)
* [`td plugins:link PLUGIN`](#td-pluginslink-plugin)
* [`td plugins:uninstall PLUGIN...`](#td-pluginsuninstall-plugin)
* [`td plugins:uninstall PLUGIN...`](#td-pluginsuninstall-plugin-1)
* [`td plugins:uninstall PLUGIN...`](#td-pluginsuninstall-plugin-2)
* [`td plugins update`](#td-plugins-update)

## `td help [COMMAND]`

Display help for td.

```
USAGE
  $ td help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for td.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `td plugins`

List installed plugins.

```
USAGE
  $ td plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ td plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.0/src/commands/plugins/index.ts)_

## `td plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ td plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ td plugins add

EXAMPLES
  $ td plugins:install myplugin 

  $ td plugins:install https://github.com/someuser/someplugin

  $ td plugins:install someuser/someplugin
```

## `td plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ td plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ td plugins:inspect myplugin
```

## `td plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ td plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ td plugins add

EXAMPLES
  $ td plugins:install myplugin 

  $ td plugins:install https://github.com/someuser/someplugin

  $ td plugins:install someuser/someplugin
```

## `td plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ td plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ td plugins:link myplugin
```

## `td plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ td plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ td plugins unlink
  $ td plugins remove
```

## `td plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ td plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ td plugins unlink
  $ td plugins remove
```

## `td plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ td plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ td plugins unlink
  $ td plugins remove
```

## `td plugins update`

Update installed plugins.

```
USAGE
  $ td plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
