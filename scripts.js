const CART = {
    KEY: 'bkasjbdfkjasdkfjhaksdfjskd',
    contents: [],
    init(){
        //check localStorage and initialize the contents of CART.contents
        var x = document.getElementById('cart')
        x.style.display = "none";
        let _contents = localStorage.getItem(CART.KEY);
        if(_contents){
            CART.contents = JSON.parse(_contents);
        }else{
            // //dummy test data
            // CART.contents = [
            //     {id:1, title:'Apple', qty:5, itemPrice: 0.85},
            //     {id:2, title:'Banana', qty:3, itemPrice: 0.35},
            //     {id:3, title:'Cherry', qty:8, itemPrice: 0.05}
            // ];
            CART.sync();
        }
    },
    async sync(){
        let _cart = JSON.stringify(CART.contents);
        await localStorage.setItem(CART.KEY, _cart);

    },
    find(id){
        //find an item in the cart by it's id
        let match = CART.contents.filter(item=>{
            if(item.id == id)
                return true;
        });
        if(match && match[0])
            return match[0];
    },
    add(id){
        //add a new item to the cart
        //check that it is not in the cart already
        if(CART.find(id)){
            CART.increase(id, 1);
        }else{
            let arr = PRODUCTS.filter(product=>{
                if(product.id == id){
                    return true;
                }
            });
            if(arr && arr[0]){
                let obj = {
                    id: arr[0].id,
                    title: arr[0].title,
                    qty: 1,
                    itemPrice: arr[0].price
                };
                CART.contents.push(obj);
                //update localStorage
                CART.sync();
            }else{
                //product id does not exist in products data
                console.error('Invalid Product');
            }
        }
    },
    increase(id, qty=1){
        //increase the quantity of an item in the cart
        CART.contents = CART.contents.map(item=>{
            if(item.id === id)
                item.qty = item.qty + qty;
            return item;
        });
        //update localStorage
        CART.sync()
    },
    reduce(id, qty=1){
        //reduce the quantity of an item in the cart
        CART.contents = CART.contents.map(item=>{
            if(item.id === id)
                item.qty = item.qty - qty;
            return item;
        });
        CART.contents.forEach(async item=>{
            if(item.id === id && item.qty === 0)
                await CART.remove(id);
        });
        
        //update localStorage
        CART.sync()
    },
    remove(id){
        //remove an item entirely from CART.contents based on its id
        CART.contents = CART.contents.filter(item=>{
            if(item.id !== id)
                return true;
        });
        if(CART.contents.length == 0){
            let cartSection = document.getElementById('cart');
            cartSection.innerHTML = "";
            
            let x = document.createElement('h2');
            x.textContent = "Shopping Cart : ";
            x.className = 'title';
            cartSection.appendChild(x);
            cartSection.appendChild(document.createElement('br'))

            let msg = document.createElement('h3');
            msg.textContent = "Your cart is empty";
            msg.className = 'title'
            msg.style.marginBottom = "10px"

            let btn3 = document.createElement('button');
            btn3.className = 'button';
            btn3.textContent = 'Shop now';
            btn3.style.border = "2px solid black"
            btn3.style.padding =  "0.25rem 1rem";
            btn3.style.color =  "black";
            btn3.style.cursor =  "pointer";
            btn3.style.marginLeft = "5px";
            btn3.addEventListener("click" , showcart)
            cartSection.appendChild(msg);
            cartSection.appendChild(btn3);

            }
        //update localStorage
        CART.sync()
        let c = 0;
        let s = CART.sort('qty');
        s.forEach(item=>{
            c = c + 1;
        })
        $('#cart-items').html(c.toString()); 
    },
    empty(){
        //empty whole cart
        CART.contents = [];
        //update localStorage
        CART.sync()
    },
    sort(field='title'){
        //sort by field - title, price
        //return a sorted shallow copy of the CART.contents array
        let sorted = CART.contents.sort( (a, b)=>{
            if(a[field] > b[field]){
                return 1;
            }else if(a[field] < a[field]){
                return -1;
            }else{
                return 0;
            }
        });
        return sorted;
        //NO impact on localStorage
    },
    logContents(prefix){
        console.log(prefix, CART.contents)
    }
};

let PRODUCTS = [];
var items = [];

var temp = [{
        "id":123,
        "title":"Wonder Womane Figurine",
        "desc":"The Wonder Woman collectible figure carries a long spear across her shoulders, and her iconic shield grasped firmly at her side - but above all, she carries the Amazons' message of peace and justice.",
        "img":"wonder-woman.jpg",
        "price":50.34
    },{
        "id":456,
        "title":"Batman Figurine",
        "desc":"This new limited edition MEGA-sized Batman figurine towers over 34 cm tall, the impressive dark statuette is produced in polyresin and is individually hand painted. The Dark Knight stands on top of a gargoyle, captured in his iconic grey Batsuit and scalloped cape with pure determination oozing from Batman as he watches over the corrupt Gotham City and strikes fear into the heart of criminals everywhere. ",
        "img":"batman.jpg",
        "price":43.21
    },{
        "id":789,
        "title":"Superman",
        "desc":"Inspired by the 2001 Justice League™ Animated TV Series this epic Superman Figurine illustrates the classic red and yellow shield featured on Clark Kent's famous costume and is guaranteed to keep your collection protected at all costs! The Superman figurine comes complete in retro-style blister packaging with a 12-page magazine focusing on the tenants and tales of Metropolis.",
        "img":"superman.jpg",
        "price":45.67
    },{
        "id":987,
        "title":"HulkBuster",
        "desc":"The screen authentic vinyl-made collectible figure under Power Pose series is specially crafted based on the appearance of Hulkbuster in Avengers: Infinity War. This colossal figure stands approximately 50cm tall with 18 LED light-up functions scattered throughout the armor. This sixth scale figure is meticulously painted gunmetal grey to scare even the mightiest.",
        "img":"hulkbuster.jpg",
        "price":78.90
    },{
        "id":654,
        "title":"Darkseid",
        "desc":"The Darkseid figure has been sculpted in exquisite detail, revealing Darkseids bulging muscles as he stands boldly towering over Superman's cape. Posed in an intimidating manner wearing his iconic blue tunic with matching boots and a belt holding him tightly around his waist, ready to cast a shadow wherever he goes...",
        "img":"darkseid.jpg",
        "price":76.54
    }]
    
   /* Check localStorage for product */
   if(window.localStorage.getItem('product-items'))
   {
    PRODUCTS = JSON.parse(window.localStorage.getItem('product-items'))
       showProducts(PRODUCTS)
       console.log("full")
   }

   if(!window.localStorage.getItem('product-items')){
        PRODUCTS = temp;
        localStorage.setItem("product-items", JSON.stringify(PRODUCTS));
        showProducts(PRODUCTS)
        console.log("empty")
   }
   console.log(PRODUCTS)

document.addEventListener('DOMContentLoaded', ()=>{
  
    //var items = JSON.parse(localStorage.getItem("items"));
    //showProducts(items)
    CART.init();
    //load the cart items
    showCart();
});
function showProducts( products ){
    PRODUCTS = products;
    //take data.products and display inside <section id="products">
    let imgPath = 'images\\';
    let productSection = document.getElementById('products');
    productSection.innerHTML = "";
    products.forEach(product=>{
        let card = document.createElement('div');
        card.className = 'card';
        //add the image to the card
        let img = document.createElement('img');
        img.alt = product.title;
        img.src = imgPath + product.img;
        card.appendChild(img);
    
        //add the title to the card
        let title = document.createElement('h2');
        title.textContent = product.title;
        card.appendChild(title);

        //add the price
        let price = document.createElement('p');
        let cost = new Intl.NumberFormat('en-CA', 
                     {style:'currency', currency:'CAD'}).format(product.price);
        price.textContent = cost;
        price.className = 'price';
        card.appendChild(price);
        
        //add the description to the card
        let desc = document.createElement('p');
        desc.textContent = product.desc;
        card.appendChild(desc);
        //add the button to the card

        let btn2 = document.createElement('button');
        btn2.className = 'btn';
        btn2.textContent = 'View Item';
        btn2.setAttribute('data-id', product.id);
        btn2.addEventListener('click', showProduct);
        card.appendChild(btn2);

        let btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = 'Add Item';
        btn.setAttribute('data-id', product.id);
        btn.addEventListener('click', addItem);
        card.appendChild(btn);
        //add the card to the section
        productSection.appendChild(card);
    })
}

function showCart(){
    let cartSection = document.getElementById('cart');
    cart.innerHTML = '';
    let x = document.createElement('h2');
    x.textContent = "Shopping Cart : ";
    x.className = 'title';
    cartSection.appendChild(x);
    cartSection.appendChild(document.createElement('br'))

    let s = CART.sort('qty');
    let count = 0;
    s.forEach( item =>{
        let cartitem = document.createElement('div');
        cartitem.className = 'cart-item';
        
        let title = document.createElement('h3');
        title.textContent = item.title;
        title.className = 'title'
        cartitem.appendChild(title);
        
        let controls = document.createElement('div');
        controls.className = 'controls';
        cartitem.appendChild(controls);
        
        let plus = document.createElement('span');
        plus.textContent = '+';
        plus.setAttribute('data-id', item.id)
        controls.appendChild(plus);
        plus.addEventListener('click', incrementCart)
        
        let qty = document.createElement('span');
        qty.textContent = item.qty;
        controls.appendChild(qty);
        
        let minus = document.createElement('span');
        minus.textContent = '-';
        minus.setAttribute('data-id', item.id)
        controls.appendChild(minus);
        minus.addEventListener('click', decrementCart)
        
        let price = document.createElement('div');
        price.className = 'price';
        price.textContent = item.itemPrice + "$";
        cartitem.appendChild(price);
        
        cartSection.appendChild(cartitem);

        count = count + 1;
    })
    let total = document.createElement('h3');
    total.textContent = "Total Price : ";
    total.style.paddingTop = "5px";
    total.className = 'title'
    cartSection.appendChild(total);

    let totalprice = document.createElement('h4');
    totalprice.textContent = "0$";
    totalprice.style.paddingTop = "5px";
    totalprice.className = 'amount';
    cartSection.appendChild(totalprice);

    let btn2 = document.createElement('button');
        btn2.className = 'button';
        btn2.textContent = 'Checkout';
        btn2.style.border = "2px solid black"
        btn2.style.padding =  "0.25rem 1rem";
        btn2.style.color =  "black";
        btn2.style.cursor =  "pointer";
        btn2.style.marginTop = "15px";
        cartSection.appendChild(btn2);

    let btn3 = document.createElement('button');
        btn3.className = 'button';
        btn3.textContent = 'Continue shopping';
        btn3.style.border = "2px solid black"
        btn3.style.padding =  "0.25rem 1rem";
        btn3.style.color =  "black";
        btn3.style.cursor =  "pointer";
        btn3.style.marginTop = "15px";
        btn3.style.marginLeft = "15px";
        btn3.addEventListener("click" , showcart)
        cartSection.appendChild(btn3);

    $('#cart-items').html(count.toString());

    if(count == 0){
        let msg = document.createElement('h3');
        msg.textContent = "Your cart is empty";
        msg.className = 'title'
        msg.style.marginBottom = "10px"
        cartSection.appendChild(msg);
        cartSection.removeChild(btn2)
        cartSection.removeChild(btn3)
        cartSection.removeChild(total)
        cartSection.removeChild(totalprice)


        let btn = document.createElement('button');
        btn.className = 'button';
        btn.textContent = 'Shop Now';
        btn.style.border = "2px solid black"
        btn.style.padding =  "0.25rem 1rem";
        btn.style.color =  "black";
        btn.style.cursor =  "pointer";
        btn.style.marginLeft = "5px";
        btn.addEventListener("click" , showcart)
        cartSection.appendChild(btn);
        
    }

    var sum = 0;
    CART.contents.forEach( item =>{
        sum = sum + ( item.qty * item.itemPrice );
    })
    console.log(sum);
    $('.amount').html(sum.toString());
}

function incrementCart(ev){
    ev.preventDefault();
    let id = parseInt(ev.target.getAttribute('data-id'));
    CART.increase(id, 1);
    let controls = ev.target.parentElement;
    let qty = controls.querySelector('span:nth-child(2)');
    let item = CART.find(id);
    if(item){
        qty.textContent = item.qty;
    }else{
        document.getElementById('cart').removeChild(controls.parentElement);
    }
    var sum = 0;
    CART.contents.forEach( item =>{
        sum = sum + ( item.qty * item.itemPrice );
    })
    console.log(sum);
    $('.amount').html(sum.toString()+"$");
}

function decrementCart(ev){
    ev.preventDefault();
    let id = parseInt(ev.target.getAttribute('data-id'));
    CART.reduce(id, 1);
    let controls = ev.target.parentElement;
    let qty = controls.querySelector('span:nth-child(2)');
    let item = CART.find(id);
    if(item){
        qty.textContent = item.qty;
    }else{
        document.getElementById('cart').removeChild(controls.parentElement);
    }
    var sum = 0;
    CART.contents.forEach( item =>{
        sum = sum + ( item.qty * item.itemPrice );
    })
    console.log(sum);
    $('.amount').html(sum.toString()+"$");
}



function showcart(){
    var x = document.getElementById('cart')
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function addItem(ev){
    ev.preventDefault();
    let id = parseInt(ev.target.getAttribute('data-id'));
    CART.add(id, 1);
    showCart();
}

function showProduct(ev){
    ev.preventDefault();
    let id = parseInt(ev.target.getAttribute('data-id'));
    console.log('View item', id);
    PRODUCTS.forEach(item =>{
        if(id == item.id){
            let imgPath = 'images\\';
            let productSection2 = document.getElementById('products');
            let over = document.createElement('div');
            over.id = "overlay";
            let car = document.createElement('div');
            car.className = "popup"; 
            //add the image to the card
            let img = document.createElement('img');
            img.className = 'image';
            img.alt = item.title;
            img.src = imgPath + item.img;
            car.appendChild(img);
        
            //add the title to the card
            let title = document.createElement('h2');
            title.textContent = item.title;
            car.appendChild(title);
    
            //add the price
            let price = document.createElement('p');
            let cost = new Intl.NumberFormat('en-CA', 
                         {style:'currency', currency:'CAD'}).format(item.price);
            price.textContent = cost;
            price.className = 'price';
            car.appendChild(price);
            
            //add the description to the card
            let desc = document.createElement('p');
            desc.textContent = item.desc;
            car.appendChild(desc);

            let btn = document.createElement('button');
            let i = document.createElement('i')
            btn.className = 'btn';
            btn.textContent = 'Add to cart';
            i.className = "fas fa-cart-plus"
           // btn.style.width = "40px"
            btn.style.height = "30px"
            btn.appendChild(i);
            btn.setAttribute('data-id', item.id);
            btn.addEventListener('click', addItem);
            car.appendChild(btn);

            let text = document.createElement('h2');
            text.textContent = "Click here to close window";
            text.style.paddingTop = "50px"
            over.appendChild(text);

            over.appendChild(car)
            productSection2.appendChild(over);
            console.log('asdasdasdasdasd')

            window.onclick = function(event) {
                if (event.target == over) {
                  over.style.display = "none";
                }
            }
        }
    })
}
function close(ev){
      var x = document.getElementById('overlay')
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function errorMessage(err){
    //display the error message to the user
    console.error(err);
}


function form(){
     window.open("new_product.html")

}

function showchat(){
    window.open("http://localhost:3000/")

}
    
function newProduct(){
    var tempid = document.getElementById("product_id").value
    var id = parseInt(tempid)
    var title = document.getElementById("product_name").value
    var price = document.getElementById("product_price").value
    var des = document.getElementById("product_description").value
    var img = document.getElementById("image").value
    
    var newItem = 
        {
    "id":id,
    "title":title,
    "desc":des,
    "img":img,
    "price":price
        }

    var arr = JSON.parse(localStorage.getItem("product-items"))
    arr.push(newItem)
    localStorage.setItem("product-items", JSON.stringify(arr));
    window.close("new_product.html")
    
}
