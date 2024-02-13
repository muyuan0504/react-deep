export const customReducer = (list, action) => {
    switch (action.type) {
        case 'add': {
            return [
                ...list,
                {
                    id: action.id,
                    text: action.text,
                    done: false,
                },
            ]
        }
        default:
            break
    }
}
