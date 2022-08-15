async function fetchAPI(url) {
    const response = await fetch(url);
    const jsonBody = await response.json();
    return jsonBody;
}

function getOptionSelected(name) {
     return name.options[name.selectedIndex];
}

function getNameEstado(estadosSelect) {
    const estadoSeleciondo = getOptionSelected(estadosSelect).innerHTML;
    return estadoSeleciondo;
}

function getCidade(cidade) {
    const cidadeSelecionada = getOptionSelectedValue(cidade);
    return cidadeSelecionada;
}

function updateData(data, element) {
    const dataElement = document.querySelector(`${element}`);
    dataElement.innerHTML = data;
}

function tempConverser(value, fromTemp="k", toTemp="c", format=true) {
    `
        By defaut, the initial unit is kelvin, and the final is celsius, and it will format
    `
    if (fromTemp == "k") {
        if (toTemp == "c") {
            value = (value - 273.15).toFixed(1);
        } else if (toTemp == "f") {
            value = (value * 1.8 - 459.67).toFixed(1);
        } 
    } else if (fromTemp == "f") {
        if(toTemp == "c") {
            value = ((value - 32) / 0.555).toFixed(1)
        } else if (toTemp == "k") {
            value = (value / 1.8 + 459.67).toFixed(1)
        } 
    } else if (fromTemp == "c") {
        if(toTemp == "f") {
            value = (value * 1.800 + 32).toFixed(1);
        } else if (toTemp == "k") {
            value = (value + 273.15).toFixed(1);
        } else {
            console.log("Accepted values: c-celsius, f-fahrenheit, k-kelvin");
        }
    }

    if (format == true) {
        return value + `°${toTemp.toUpperCase()}`
    } else {
        return value;
    }
}

// show the cities of the state selected.
function showCidades(estadoSelecionado) {
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`)
    .then(response => response.json())
    .then(cidades => {
        const cidadesSelect = document.querySelector("#cidades");
        cidadesSelect.innerHTML = cidades.map((cidade) => {
            return `
              <option value='${cidade.nome}'>
                ${cidade.nome}
              </option>
            `;
          }).join('');
    })
}

function getOptionSelectedValue(name) {
    return name.options[name.selectedIndex].value;
}

function getEstado(estadosSelect) {
    const estadoSelecionado = getOptionSelectedValue(estadosSelect);
    showCidades(estadoSelecionado);
    return estadoSelecionado;
}

export {
    getEstado,
    getOptionSelectedValue,
    showCidades,
    tempConverser,
    updateData,
    getCidade,
    getNameEstado,
    getOptionSelected,
    fetchAPI,
}