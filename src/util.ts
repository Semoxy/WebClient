export function concatClasses(...names: (string | undefined | false | null)[]) {
    return names.filter(e => !!e).join(" ")
}
