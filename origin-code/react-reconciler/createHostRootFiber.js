/** 创建根节点，根级别的 Fiber 节点是整个应用程序的入口，它管理和协调应用的更新
 *  使用 ReactDOM.createRoot 时，React 会通过 ConcurrentRoot 标志启用并发模式和新的协调器，默认传入 1，即启用
 */
export function createHostRootFiber(tag: RootTag, isStrictMode: boolean, concurrentUpdatesByDefaultOverride: null | boolean): Fiber {
    let mode
    if (tag === ConcurrentRoot) {
        mode = ConcurrentMode
        if (isStrictMode === true) {
            mode |= StrictLegacyMode

            if (enableStrictEffects) {
                mode |= StrictEffectsMode
            }
        } else if (enableStrictEffects && createRootStrictEffectsByDefault) {
            mode |= StrictLegacyMode | StrictEffectsMode
        }
        if (
            // We only use this flag for our repo tests to check both behaviors.
            // TODO: Flip this flag and rename it something like "forceConcurrentByDefaultForTesting"
            !enableSyncDefaultUpdates ||
            // Only for internal experiments.
            (allowConcurrentByDefault && concurrentUpdatesByDefaultOverride)
        ) {
            mode |= ConcurrentUpdatesByDefaultMode
        }
    } else {
        mode = NoMode
    }

    if (enableProfilerTimer && isDevToolsPresent) {
        // Always collect profile timings when DevTools are present.
        // This enables DevTools to start capturing timing at any point–
        // Without some nodes in the tree having empty base times.
        mode |= ProfileMode
    }


    // packages\react-reconciler\src\ReactWorkTags.js
    // export const HostRoot = 3; // Root of a host tree. Could be nested inside another node.
    return createFiber(HostRoot, null, null, mode)
}

const createFiber = function (tag: WorkTag, pendingProps: mixed, key: null | string, mode: TypeOfMode): Fiber {
    // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
    return new FiberNode(tag, pendingProps, key, mode)
}
