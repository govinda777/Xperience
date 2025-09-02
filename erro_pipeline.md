Skip to content
Navigation Menu
govinda777
Xperience

Type / to search
Code
Issues
Pull requests
1
Discussions
Actions
Projects
Wiki
Security
10
Insights
Settings
Build and Deploy
up #142
Jobs
Run details
Annotations
1 error
build
failed 15 minutes ago in 3m 5s
Search logs
2s
1s
2s
0s
2m 27s
6s
0s
0s
3s
23s
`build.rollupOptions.external`
Additionally, handling the error in the 'buildEnd' hook caused the following error:
[vite]: Rollup failed to resolve import "unenv/node/process" from "/home/runner/work/Xperience/Xperience/node_modules/react/jsx-runtime.js".
This is most likely unintended because it can break your application at runtime.
If you do want to externalize this module explicitly add it to
`build.rollupOptions.external`
at getRollupError (file:///home/runner/work/Xperience/Xperience/node_modules/vite/node_modules/rollup/dist/es/shared/parseAst.js:401:41)
at file:///home/runner/work/Xperience/Xperience/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:23290:39
at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
at async catchUnfinishedHookActions (file:///home/runner/work/Xperience/Xperience/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:22749:16)
at async rollupInternal (file:///home/runner/work/Xperience/Xperience/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:23273:5)
at async build (file:///home/runner/work/Xperience/Xperience/node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:65693:14)
at async CAC.<anonymous> (file:///home/runner/work/Xperience/Xperience/node_modules/vite/dist/node/cli.js:829:5)
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
Error: Process completed with exit code 1.
0s
0s
0s
0s
0s
0s
0s
0s
0s
0s
0s
0s
0s
0s
0s
0s
up · govinda777/Xperience@e5dfce3
