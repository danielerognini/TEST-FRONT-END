export let fetchCompleted = false;
fetch('./data.json').then(response => {return response.json()}).then(data => {
    createElements(data);
    fetchCompleted = true;
});

function createElements(data) {
    let months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    let count = 0;
    let table = document.getElementById('table');
    let maxAmount = getMaxAmount(data.mesi);
    data.mesi.forEach(element => {
        let tableElement = 
        `
        <div class='box'>
            <div class='month'>${months[count]}</div>
            <div class="text">
                <span class='docs'>${element.documenti}<span> doc.</span></span>
                <span class='amount'>${element.importo}<span> €</span></span>
            </div>
            <div class="fill-container">
                <div class="fill" style="height: ${getHeight(maxAmount, element.importo)}%"></div>
            </div>
            <div class='selection'><div></div></div>
        </div>
        `;
        
        table.innerHTML += tableElement;
        count === 12 ? count = 0 : count += 1;
    });
}

function getMaxAmount(data) {
    let maxAmount = data[0].importo;
    data.forEach(element => {
        if(maxAmount < element.importo) {
            maxAmount = element.importo;
        }
    });
    return maxAmount;
}

function getHeight(maxAmount, amount) {
    //amount : maxAmount = height : 100
    let height = amount * 100 / maxAmount;
    return Math.round(height); //giving back an integer value
}