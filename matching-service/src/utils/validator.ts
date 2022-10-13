/**
 * Checks specified arguments against an array of validators.
 * @param args 
 * @param validators 
 */
export async function checkValidators<T>(
    args: T,
    validators: ((args: T) => Promise<void>)[]
) {
    for (const v of validators) {
        await v(args);
    }
}