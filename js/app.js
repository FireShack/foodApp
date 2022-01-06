const btnCreateOrder = document.querySelector('#guardar-cliente')
const foodTextInCont = document.querySelector('#add-elements')
const error = document.createElement('p')

btnCreateOrder.addEventListener('click', validateForm)

const foodCategory = {
    1: 'food',
    2: 'drinks',
    3: 'desserts'
}

let newClient = {
    table: '',
    hour: '',
    order: []
}

function validateForm() {
    const date = new Date()

    const modalBs = document.querySelector('#formulario')
    const modalInstance = bootstrap.Modal.getInstance(modalBs)

    const table = document.querySelector('#mesa').value
    const hour = document.querySelector('#hora').value

    if (table === '' || hour === '') {
        showError('You must complete all fields')
        return
    }

    newClient = {...newClient, table, hour }
    console.log(newClient)
    modalInstance.hide()
    showSections()
    catchData()

}

function showError(msg) {
    const modalErrorCont = document.querySelector('#form')


    error.classList.add('p-3', 'mt-2', 'bg-danger', 'text-center', 'text-white', 'rounded')
    error.textContent = msg
    modalErrorCont.appendChild(error)

    setTimeout(() => {
        error.remove()
    }, 2000);
}

function showSections() {
    const sections = document.querySelectorAll('.d-none')
    sections.forEach(section => section.classList.remove('d-none'))
}

function catchData() {
    const url = 'http://localhost:3000/platillos'

    fetch(url)

    .then(data => {
        return data.json()
    })

    .then(data => {
        createHTML(data)
    })
}

function createHTML(data) {
    const foodCont = document.querySelector('#platillos .contenido')


    foodCont.classList.remove('d-none')
    data.forEach(food => {

        let i = 0
        const row = document.createElement('DIV');
        row.classList.add('row', 'border-top');

        const foodName = document.createElement('DIV');
        foodName.classList.add('col-md-4', 'py-3');
        foodName.textContent = food.nombre;

        const foodPrice = document.createElement('DIV');
        foodPrice.classList.add('col-md-3', 'py-3', 'fw-bold');
        foodPrice.textContent = `$${food.precio}`;

        const category = document.createElement('DIV');
        category.classList.add('col-md-3', 'py-3');
        category.textContent = `#${foodCategory[food.categoria]}`;

        const btnCont = document.createElement('div')
        btnCont.classList.add('d-flex', 'justify-content-around', 'mt-2')

        const addBtn = document.createElement('button');
        addBtn.classList.add('btn', 'btn-primary')
        addBtn.textContent = '+'

        const restBtn = document.createElement('button');
        restBtn.classList.add('btn', 'btn-primary')
        restBtn.textContent = '-'

        const btnAmount = document.createElement('input');
        btnAmount.type = 'number';
        btnAmount.value = 0;
        btnAmount.id = `producto-${food.id}`;
        btnAmount.classList.add('form-control', 'text-center');
        btnAmount.readOnly = true

        btnCont.appendChild(restBtn)
        btnCont.appendChild(addBtn)

        addBtn.onclick = () => {
            btnAmount.value = ++i;
            const amount = Number(btnAmount.value)
            addFood({...food, amount })
        }
        restBtn.onclick = () => {
            if (btnAmount.value > 0) {
                btnAmount.value = --i;
                const amount = Number(btnAmount.value)
                addFood({...food, amount })
            }
        }

        const amountDiv = document.createElement('DIV');
        amountDiv.classList.add('col-md-2', 'py-3');
        amountDiv.appendChild(btnAmount);
        amountDiv.appendChild(btnCont)


        row.appendChild(foodName);
        row.appendChild(foodPrice);
        row.appendChild(category);
        row.appendChild(amountDiv);

        foodCont.appendChild(row);

    })

}

function addFood(food) {

    let { order } = newClient

    if (food.amount > 0) {

        if (order.some(product => product.id === food.id)) {

            const updateOrder = order.map(product => {
                if (product.id === food.id) {
                    product.amount = food.amount

                }
                return product
            })
            newClient.order = [...updateOrder]
        } else {
            newClient.order = [...order, food]
        }

    } else {
        const deleteProduct = order.filter(product => product.id !== food.id)
        newClient.order = deleteProduct
    }

    cleanHTML()

    if (newClient.order.length) {
        foodTextInCont.remove()
        createResume()
    } else {
        emptyMsg();
    }
}

function createResume() {
    const resumeCont = document.querySelector('#resume')


    const resumen = document.createElement('DIV');
    resumen.classList.add('py-5', 'px-3', 'shadow');
    // Mostrar la table
    resumeCont.classList.add('col-md-6')

    const table = document.createElement('P');
    table.textContent = 'Table: ';
    table.classList.add('fw-bold');

    const tableSpan = document.createElement('SPAN');
    tableSpan.textContent = newClient.table;
    tableSpan.classList.add('fw-normal');
    table.appendChild(tableSpan);

    // hour
    const hour = document.createElement('P');
    hour.textContent = 'Hour: ';
    hour.classList.add('fw-bold');

    const hourSpan = document.createElement('SPAN');
    hourSpan.textContent = newClient.hour;
    hourSpan.classList.add('fw-normal');
    hour.appendChild(hourSpan);


    // Mostrar los platillos Consumidos!

    const heading = document.createElement('H3');
    heading.textContent = 'Orders';
    heading.classList.add('my-4');


    const group = document.createElement('UL');
    group.classList.add('list-group');

    // Producto order
    const { order } = newClient;
    order.forEach(food => {

        const { nombre, amount, precio, id } = food;

        const list = document.createElement('LI');
        list.classList.add('list-group-item');

        const nameText = document.createElement('h4');
        nameText.classList.add('text-center', 'my-4');
        nameText.textContent = nombre;

        const amountText = document.createElement('P');
        amountText.classList.add('fw-bold');
        amountText.textContent = 'Amount: ';

        const amountValue = document.createElement('SPAN');
        amountValue.classList.add('fw-normal');
        amountValue.textContent = amount;

        const price = document.createElement('P');
        price.classList.add('fw-bold');
        price.textContent = 'Price: ';


        const priceValue = document.createElement('SPAN');
        priceValue.classList.add('fw-normal');
        priceValue.textContent = `$${precio}`;

        const subTotal = document.createElement('P');
        subTotal.classList.add('fw-bold');
        subTotal.textContent = 'Subtotal: ';


        const subTotalValue = document.createElement('SPAN');
        subTotalValue.classList.add('fw-normal');
        subTotalValue.textContent = calculateTotal(food)

        // Botón para Eliminar
        const btnDelete = document.createElement('BUTTON');
        btnDelete.classList.add('btn', 'btn-danger');
        btnDelete.textContent = 'Delete order';

        // Funcion para eliminar ese contenido
        btnDelete.onclick = () => {
            deleteOrder(id)
        }

        // Agregar los Labels a sus contenedores
        amountText.appendChild(amountValue)
        price.appendChild(priceValue)
        subTotal.appendChild(subTotalValue);


        list.appendChild(nameText);
        list.appendChild(amountText);
        list.appendChild(price);
        list.appendChild(subTotal);
        list.appendChild(btnDelete);

        group.appendChild(list);

    })
    resumen.appendChild(table);
    resumen.appendChild(hour);
    resumen.appendChild(heading);
    resumen.appendChild(group);

    resumeCont.appendChild(resumen)
    tips()

}

function calculateTotal(order) {
    const { precio, amount } = order
    const result = Number(precio * amount)
    return `$ ${result}`
}

function deleteOrder(id) {
    const deleteOrder = newClient.order.filter(order => order.id !== id)
    newClient.order = [...deleteOrder]

    cleanHTML()
    if (newClient.order.length) {
        createResume()
    } else {
        emptyMsg();
    }

    const deletedArticle = `#producto-${id}`
    const article = document.querySelector(deletedArticle)
    article.value = 0
}

function cleanHTML() {
    const resumeCont = document.querySelector('#resume')
    const totalCont = document.querySelector('#total')
    const textCont = document.querySelector('#text-empty');

    while (resumeCont.firstChild) {
        resumeCont.removeChild(resumeCont.firstChild)
    }
    while (totalCont.firstChild) {
        totalCont.removeChild(totalCont.firstChild)
    }
    while (textCont.firstChild) {
        textCont.removeChild(textCont.firstChild)
    }

}

function tips() {
    const totalCont = document.querySelector('#total')

    const formCont = document.createElement('DIV');
    formCont.classList.add('col-md-6', 'formCont');

    const heading = document.createElement('H3');
    heading.classList.add('my-4');
    heading.textContent = 'Select tips';

    // tips 0
    const checkDiv0 = document.createElement('DIV');
    checkDiv0.classList.add('form-check');

    const checkBox0 = document.createElement('INPUT');
    checkBox0.type = 'radio';
    checkBox0.name = 'tips';
    checkBox0.value = '0';
    checkBox0.classList.add('form-check-input');
    checkBox0.onclick = calculateTips
    const checkLabel0 = document.createElement('LABEL');
    checkLabel0.textContent = 'No tips';
    checkLabel0.classList.add('form-check-label');

    checkDiv0.appendChild(checkBox0)
    checkDiv0.appendChild(checkLabel0)

    // tips 10%
    const checkBox10 = document.createElement('INPUT');
    checkBox10.type = 'radio';
    checkBox10.name = 'tips';
    checkBox10.value = '10';
    checkBox10.classList.add('form-check-input');
    checkBox10.onclick = calculateTips;

    const checkLabel10 = document.createElement('LABEL');
    checkLabel10.textContent = '10%';
    checkLabel10.classList.add('form-check-label');

    const checkDiv10 = document.createElement('DIV');
    checkDiv10.classList.add('form-check');

    checkDiv10.appendChild(checkBox10);
    checkDiv10.appendChild(checkLabel10);

    // tips 25%
    const checkBox25 = document.createElement('INPUT');
    checkBox25.type = 'radio';
    checkBox25.name = 'tips';
    checkBox25.value = '25';
    checkBox25.classList.add('form-check-input');
    checkBox25.onclick = calculateTips;

    const checkLabel25 = document.createElement('LABEL');
    checkLabel25.textContent = '25%';
    checkLabel25.classList.add('form-check-label');

    const checkDiv25 = document.createElement('DIV');
    checkDiv25.classList.add('form-check');

    checkDiv25.appendChild(checkBox25);
    checkDiv25.appendChild(checkLabel25);

    // tips 50%
    const checkBox50 = document.createElement('INPUT');
    checkBox50.type = 'radio';
    checkBox50.name = 'tips';
    checkBox50.value = '50';
    checkBox50.classList.add('form-check-input');
    checkBox50.onclick = calculateTips;

    const checkLabel50 = document.createElement('LABEL');
    checkLabel50.textContent = '50%';
    checkLabel50.classList.add('form-check-label');

    const checkDiv50 = document.createElement('DIV');
    checkDiv50.classList.add('form-check');

    checkDiv50.appendChild(checkBox50);
    checkDiv50.appendChild(checkLabel50);

    formCont.appendChild(heading);
    formCont.appendChild(checkDiv0);
    formCont.appendChild(checkDiv10);
    formCont.appendChild(checkDiv25);
    formCont.appendChild(checkDiv50);

    totalCont.appendChild(formCont);
}


function emptyMsg() {
    const textCont = document.querySelector('#text-empty');

    const text = document.createElement('P');
    text.classList.add('text-center');
    text.textContent = 'Add new products';

    textCont.appendChild(text);
}

function calculateTips() {
    const selectedRadio = document.querySelector('[name="tips"]:checked').value
    const { order } = newClient

    let subtotal = []

    order.forEach(food => {
        const { precio, amount } = food
        const result = precio * amount
        subtotal = [...subtotal, result]
    })

    const subTotalToPay = subtotal.reduce((a, b) => a + b)
    const result = subTotalToPay * selectedRadio / 100
    const totalToPay = subTotalToPay + result

    const modalBs = document.querySelector('#modal-total')
    const modalTitle = document.querySelector('.modal-title')
    const modalSubtotal = document.querySelector('.subtotal')
    const modalTips = document.querySelector('.tips')
    const modalToTotal = document.querySelector('.total')
    const modalTotal = new bootstrap.Modal(modalBs)

    modalTitle.textContent = 'Total to pay'
    modalSubtotal.textContent = `SubTotal: $${subTotalToPay}`
    modalTips.textContent = `+$${result}`
    modalToTotal.textContent = `Total: $${totalToPay}`

    modalTotal.show()
    successMsg()
}

function successMsg() {
    const spinner = document.querySelector('.sk-folding-cube')
    const image = document.querySelector('.success-image')

    spinner.classList.remove('d-none')
    image.classList.add('d-none')

    setTimeout(() => {
        image.classList.remove('d-none')
        spinner.classList.add('d-none')
    }, 5000);
}