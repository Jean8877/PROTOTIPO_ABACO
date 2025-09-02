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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m18.988 2.012l3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287l-3-3L8 13z"/><path fill="currentColor" d="M19 19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2z"/></svg>
                    </button>
                </td>
                <td>
                    <!--- boton de eliminar --->
                    <button type='button' class='btn btn-warning'
                        onclick="eliminar(${item.id_tipo_usuario})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/></svg>
                    </button>
                </td>
            </tr>`;
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


// 