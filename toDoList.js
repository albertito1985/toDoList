
let itemslist;

function setUp(){
   List.load();
   List.show();
   List.loadListeners();
   loadSubmitListener();
}

const List = {
    items : [],
    addItem : (item)=>{

        List.items.push({item: item,crossedOut:false});
        List.saveLocally();
        List.refresh();
    },
    load : ()=>{
        if (localStorage.getItem('listUI') !== null) {
            List.items = JSON.parse(localStorage.getItem('listUI'));
            return true
          }
          return false
    },
    saveLocally: ()=>{
        if(List.items != null){
            localStorage.setItem('listUI', JSON.stringify(List.items));
            return true
        }
        return false
    },
    show: ()=>{
        if(List.items.length != 0){
            let itemsListUI=document.createElement('ul');
            itemsListUI.classList.add("list-group", "rounded-0");
            itemsListUI.classList.add("list-unstyled");
            List.items.forEach((item,index)=>{
                let listItemUI = document.createElement('li');
                listItemUI.classList.add("shoppinglistItem" , "p-2", "list-group-item", "d-flex", "justify-content-between", "align-items-start", "mt-3");
                if(item.crossedOut)listItemUI.classList.add("crossedOut");
                listItemUI.dataset.listIndex = index;
                listItemUI.textContent = item.item;
                let button = document.createElement("button");
                button.type = "button";
                button.ariaLabel = "Close";
                button.classList.add("btn-close", "listItemRemove");
                listItemUI.appendChild(button);
                itemsListUI.appendChild(listItemUI);
            })
            document.getElementById("listUI").textContent ="";
            document.getElementById("listUI").appendChild(itemsListUI);
        }else{
            document.getElementById("listUI").textContent =":( There are no items on the list.";
        }   
    },
    crossItemOut: (item)=>{
        let targetIndex = item.target.dataset.listIndex;
        List.items[targetIndex].crossedOut = !List.items[targetIndex].crossedOut;
        List.saveLocally();
        List.refresh();
    },
    loadListeners: ()=>{
        let listItems = document.getElementsByClassName("shoppinglistItem");

        Array.from(listItems).forEach((item)=>{
            item.removeEventListener("click", List.crossItemOut.bind(item));
            item.addEventListener("click", List.crossItemOut.bind(item));
        });

        let listItemsRemove = document.getElementsByClassName("listItemRemove");
        Array.from(listItemsRemove).forEach((item)=>{
            item.removeEventListener("click", List.removeItem.bind(item));
            item.addEventListener("click", List.removeItem.bind(item));
        });
    },
    removeItem: (item)=>{
        event.stopPropagation();
        let index = item.target.parentElement.dataset.listIndex;
        List.items.splice(index,1);
        List.saveLocally();
        List.refresh();
    },
    refresh: ()=>{
        List.show();
        List.loadListeners();
    }

}

setUp();

function validationForm(e){
    e.preventDefault();
    let validation = true;
    let elements= e.target.elements
    for(element of elements){
        if(element.value!=""){
            element.classList.remove("is-invalid");
            List.addItem(element.value);
            this.reset();

        }else{
            if(element.type != "submit"){
                validation= false;
                element.classList.add("is-invalid");
            }
        }
    };
}

function loadSubmitListener(){
    document.getElementById("myForm").removeEventListener("submit", validationForm);
    document.getElementById("myForm").addEventListener("submit", validationForm);
}
