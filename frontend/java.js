const BASE_URL = 'http://127.0.0.1:5000/';

function visualizar(data) {
    let tabla = "";

    data.baul.forEach(item => {
        tabla += `
            <tr data-id="${item =>id_tipo_usuario}">
                <td>${item.id_tipo_usuario}</td>
                <td>${item.descripcion}</td>
                <td>
                    <!--- boton de editar --->
                    <button type='button' class='btn btn-info'
                        onclick="location..href='.html?variable=${item.id_tipo_usuario}'">
                         





            </tr>  
        
    })
}

function consulta_general(){
    fetch(`${BASE_URL}/tipo_usuario`)
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => visualizar(data))
    .catch(error => console.error('Error:', error));
}