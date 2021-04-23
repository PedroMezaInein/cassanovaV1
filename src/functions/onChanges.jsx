export function onChangeAdjunto(e, form) {
    const { files, value, name } = e.target
    let aux = []
    files.forEach((file, index) => {
        aux.push({
            name: file.name,
            file: file,
            url: URL.createObjectURL(file),
            key: index
        })
    });
    form.adjuntos[name].value = value
    form.adjuntos[name].files = aux
    return form
}