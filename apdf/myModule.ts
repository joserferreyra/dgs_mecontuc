
export function loadConfigFrom(filename: string): any {

    const text = Deno.readTextFileSync(filename);

    return JSON.parse(text);
}

export function exists(filePath: string): boolean {
    try {
        Deno.statSync(filePath);
        return true;
    } catch (err) {        
        return false;
    }
}
