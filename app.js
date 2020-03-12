var budgetController = (function() {
     
    var data = {
        budget: 0,
        inc : {
            items : [],
            sum : 0
        },
        exp : {
            items : [],
            sum : 0
        }
    }

    var Item = function(name, val, id, percentage) {
        this.name = name;
        this.val = val;
        this.id = id;
        this.percentage = -1;
    }

    Item.prototype.calculatePercentage = function(total) {
        this.percentage = ((this.val / total) * 100).toFixed(2);
    }

    Item.prototype.getPercentage = function() {
        return this.percentage;
    }
    var getId = function(list) {
        console.log("getID" + list.length);
        return list.length > 0 ? list[list.length - 1].id + 1 : 0;
    }

    var removeItem = function(id, obj) {
        var item, index;
        obj.items.forEach(function(cur, i) {
            if(cur.id === id) {
                index = i;
                item = cur;
                return true;
            }
        });
        
        obj.sum -= item.val;
        obj.items.splice(index,1);

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

        deleteItem: function(idStr) {
            var id;
            id = parseInt(idStr.charAt(idStr.length - 1));
            if (idStr.includes('income')) {
                removeItem(id, data.inc);
            } else {
                removeItem(id, data.exp);
            }

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
        },

        getPercentages: function() {
            var allPercs =  data.exp.items.map(function(cur){
                return cur.getPercentage();
            });
            return allPercs;
        },

        getBudget: function() {
            return data.budget;
        },


        calculatePercentages : function() {
            console.log("calculatePercentages");
            data.exp.items.forEach(function(cur){
                if(data.inc.sum > 0) {
                    console.log(cur);
                    cur.calculatePercentage(data.inc.sum);
                }
                
            });
        },

        calculateBudget: function() {
            var availableBudget;
            availableBudget = this.getIncome() - this.getExpense();
            if (availableBudget > 0) {
                data.budget = availableBudget;
            } else {
                data.budget = 0;
            }
            
        }

    }
})();

var uiContorller = (function() {
    var availableBudget;

    var DOMStrings = {
        addDescription : "add__description",
        addValue : "add__value",
        addType : "add__type",
        addBtn : "add__btn",
        budgetValue : "budget__value",
        budgetIncomeValue : "budget__income--value",
        budgetExpensesValue : "budget__expenses--value",
        budgetExpensesPercentage : "budget__expenses--percentage",
        incomeContainer : "income__list",
        expenseContainer : "expenses__list",
        deleteItemBtn: "item__delete--btn",
        container: "container",
        expPercentLabel: "item__percentage",
        addErrorMessage: "add__error__message",
        budgetTitleMonth: "budget__title--month"
    }

    var nodeListForEach = function(fields, callback) {
        for (var i = 0; i < fields.length; i++) {
            callback(fields[i], i);
        }
    }

    return {

        getInput: function() {
            return {
                description : document.getElementsByClassName('add__description')[0].value,
                value : document.getElementsByClassName('add__value')[0].value,
                type : document.getElementsByClassName('add__type')[0].value
            };
        },

        displayBudgetTitleMonth : function(str) {
            var d = new Date();
            document.querySelector('.' + DOMStrings.budgetTitleMonth).innerText = str;
        },

        displayBudget : function(b) {
            document.querySelector('.budget__value').innerText = b;
        },

        displayIncome : function(i) {
            document.querySelector('.budget__income--value').innerText = "+ " + i;
        },

        displayExpense : function(e, expPercentage) {
            document.querySelector('.budget__expenses--value').innerText = "- " + e;
            document.querySelector('.budget__expenses--percentage').innerText = expPercentage + "%";
        },

        displayPercentages : function(percentages) {
            var fields = document.querySelectorAll('.' + DOMStrings.expPercentLabel);
            console.log(percentages);
            nodeListForEach(fields, function(cur, index){
                if (percentages[index] > 0) {
                    cur.textContent = percentages[index] + '%';
                } else {
                    cur.textContent = '---';
                }
            });
        },

        displayErrorMessage : function(err) {
            document.querySelector('.' + DOMStrings.addErrorMessage).innerText = err;
        },

        addItemList: function (item, type, sum) {
            var html, newHtml, element;
            console.log(item);
            if (type === 'inc') {
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%item-value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                element = DOMStrings.incomeContainer;
            } else if(type === 'exp') {
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%item-value%</div> <div class="item__percentage">%percent-value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                element = DOMStrings.expenseContainer;
            }
            newHtml = html.replace('%id%', item.id);
            newHtml = newHtml.replace("%description%", item.name);
            newHtml = newHtml.replace("%item-value%", '+ ' + item.val.toString());
            
            console.log(newHtml);

            document.querySelector('.' + element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields : function() {
            var fields, list;

            fields = document.querySelectorAll('.' + DOMStrings.addDescription + ',' +  '.' + DOMStrings.addValue);
            list =  Array.prototype.slice.call(fields);
            list.forEach(function(cur) {
                cur.value = "";
            });
            list[0].focus();
        },

        deleteListItem: function(id) {
            document.getElementById(id).remove();
        },

        getDomStrings : function() {
            return DOMStrings;
        }
    
    }

})();

var appController = (function(budgetCtrl, uiCtrl) {
    var Dom = uiCtrl.getDomStrings();
    var startsWithAlphabetsOnly = /[a-zA-Z]/;
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];

    var initDefaultValues = function() {
        uiCtrl.displayBudget(0);
        uiCtrl.displayIncome(0);
        uiCtrl.displayExpense(0, 0);
        uiCtrl.displayBudgetTitleMonth(getBudgetTitleMonth());
    }

    var setupEventListners = function() {
        // adding event to addbtn
        document.querySelector('.' + Dom.addBtn).addEventListener('click', addItem);
        document.addEventListener('keypress', function(e) {
            if (e.code === 13 || e.which === 13) {
                addItem();
            }
        })

        document.querySelector('.' + Dom.container).addEventListener('click', deleteItem);
    }

    //create events.
    var addItem = function() {
        var input, newItem, sum;
        /*
            1. get input from ui
        */
        input = uiCtrl.getInput();
        /*2. add item to the budget controller.
        3. calculate the budget */
        if (validateItem(input)) {
            newItem = budgetCtrl.addItem(input.description, parseFloat(input.value), input.type);
            sum = input.type === 'exp' ? budgetCtrl.getExpense() : budgetCtrl.getIncome();
            uiCtrl.addItemList(newItem, input.type, sum);
            uiCtrl.clearFields();
            // 4. update the uibudget.
            updateBudget();
            //5. update percentages
            updatePercentages();
            uiCtrl.displayErrorMessage("");
        }
    }

    var updateBudget = function() {
        budgetCtrl.calculateBudget();
        uiCtrl.displayBudget(budgetCtrl.getBudget());
        uiCtrl.displayIncome(budgetCtrl.getIncome());
        uiCtrl.displayExpense(budgetCtrl.getExpense(), budgetCtrl.getExpPercentage());
    }

    var updatePercentages = function() {
        budgetCtrl.calculatePercentages();
        uiCtrl.displayPercentages(budgetCtrl.getPercentages());
    }

    var deleteItem = function(e) {
        /*
            1. remove html from ui.
            2. remove particular element from budget.
            3. calculate budget.
            4. updatePercentages
        */
        var idStr, id;
        idStr = e.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(idStr);
        budgetCtrl.deleteItem(idStr);
        uiCtrl.deleteListItem(idStr);
        updateBudget();
        updatePercentages();

    }

    var validateItem = function(e) {
        console.log("validation started" + e);
        try {
            if (e.description === "") throw "Description should not be empty";
            if (!startsWithAlphabetsOnly.test(e.description.charAt(0))) throw "Description should starts with alphabets only";
            if (isNaN(parseFloat(e.value))) throw "enter valid number";
        }
        catch(e) {
            uiCtrl.displayErrorMessage(e);
            console.log("catched error----" + e);
            return false;
        }
        return true;
    }

    var getBudgetTitleMonth = function() {
        var d = new Date();
        return monthNames[d.getMonth()] + " " + d.getFullYear();
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