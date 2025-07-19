async function setup() {
    console.log("load");
    let pyodide = await loadPyodideAndPackages();
    // Now the requests library is available for use
    console.log("install");
    let code = `
        import requests

        response = requests.get('https://api.github.com')
        print(response.json())
    `;
    pyodide.runPython(code);
    console.log("finish");
}

setup();