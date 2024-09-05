export function markContainerAsRoot(hostRoot: Fiber, node: Container): void {
    node[internalContainerInstanceKey] = hostRoot
}
