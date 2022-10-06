export async function checkValidators<T>(
    args: T,
    validators: ((args: T) => Promise<void>)[]
) {
    for (const v of validators) {
        await v(args);
    }
}