var budgetController = (function() {
     
    var data = {
        inc : {
            items : [],
            sum : 0
        },
        exp : {
            items : [],
            sum : 0
        }
    }

    var Item = function(name, val, id) {
        this.name = name;
        this.val = val;
        this.id = id;
    }

    var getId = function(list) {
        console.log("getID" + list.length);
        return list.length > 0 ? list[list.length - 1].id + 1 : 0;
    }

    return {
        addItem: function(name, val, type) {
            console.log(name + " " + val + " " + type );
            // created item on the basis of type
            var item = new Item(name, val, getId(data[type].items));
            data[type].items.push(item);
            data[type].sum += val;
            return item;
        },

        getIncome: function() {
            return data.inc.sum;

        },

        getExpense: function() {
            return data.exp.sum;
        },

        getExpPercentage: function () {
            var income = data.inc.sum;
            var expense = data.exp.sum;
            if (income <= 0 || expense >= income) {
                return 100;
            }
            return ((expense / income) * 100).toFixed(2);
        }
    }
})();

var uiContorller = (function() {
    var availableBudget;

    var DOMStrings = {
        addDescription : "add__description",
        addValue : "add__value",
        addType : "add__type",
        addButton : "add__btn",
        budgetValue : "budget__value",
        budgetIncomeValue : "budget__income--value",
        budgetExpensesValue : "budget__expenses--value",
        budgetExpensesPercentage : "budget__expenses--percentage",
        incomeContainer : "income__list",
        expenseContainer : "expenses__list"
    }

    return {

        getInput: function() {
            return {
                description : document.getElementsByClassName('add__description')[0].value,
                value : document.getElementsByClassName('add__value')[0].value,
                type : document.getElementsByClassName('add__type')[0].value
            };
        },

        updateBudget : function(i, e, expPercentage) {
            availableBudget = i - e;
            document.querySelector('.budget__value').innerText = availableBudget > 0 ? "+ " + availableBudget : 0;
            document.querySelector('.budget__income--value').innerText = "+ " + i;
            document.querySelector('.budget__expenses--value').innerText = "- " + e;
            document.querySelector('.budget__expenses--percentage').innerText = expPercentage + "%";

        },

        addItemList: function (item, type) {
            var html, newHtml, element;
            console.log(item);
            if (type === 'inc') {
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%item-value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                element = DOMStrings.incomeContainer;
            } else if(type === 'exp') {
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%item-value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                element = DOMStrings.expenseContainer;

            }
            newHtml = html.replace('%id%', item.id);
            newHtml = newHtml.replace("%description%", item.name);
            newHtml = newHtml.replace("%item-value%", '+ ' + item.val.toString());

            console.log(newHtml);

            document.querySelector('.' + element).insertAdjacentHTML('afterbegin', newHtml);
        },

        getDomStrings : function() {
            return DOMStrings;
        }
    
    }

})();

var appController = (function(budgetCtrl, uiCtrl) {
    
    var initDefaultValues = function() {
        uiCtrl.updateBudget(0,0,0);

    }
    var setupEventListners = function() {
        document.querySelector('.add__btn').addEventListener('click', addItem);
        document.addEventListener('keypress', function(e){
            if(e.code === 13 || e.which === 13) {
                addItem();
            }
        });
    }

    //create events.
    var addItem = function() {
        var input, newItem;
        
        /*
            1. get input from ui
                    */
        input = uiCtrl.getInput();
        /*2. add item to the budget controller.
        3. calculate the budget */

        newItem = budgetCtrl.addItem(input.description, parseFloat(input.value), input.type);

        uiCtrl.addItemList(newItem, input.type);
        // 4. update the uibudget.
        uiCtrl.updateBudget(budgetCtrl.getIncome(), budgetCtrl.getExpense(), budgetCtrl.getExpPercentage());


    }

    return {
        init : function() {
            console.log("g*** faad denge");
            initDefaultValues();
            setupEventListners();
        }
    }
    

})(budgetController, uiContorller);

appController.init();