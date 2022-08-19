# TypeScript Migration Action

This action maintains a GitHub Issue with the current status of a TypeScript migration of source files.

## Inputs

### `source-folder`

Your source code folder. Default `"src"`.

### `base-branch`

Your base branch. Default `"main"`.

### `title`

Custom issue title. Default `"TypeScript Migration"`.

## Example usage

```yml
steps:
  - name: TypeScript Migration Status
    uses: jacklesliewise/actions-typescript-migration@main
    with:
      source-folder: 'packages/components/src'
      title: 'Neptune Components TypeScript Migration'
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```