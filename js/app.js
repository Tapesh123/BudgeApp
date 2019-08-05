class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }
  submitBudgetForm() {
    const value = this.budgetInput.value; //capture the value of budgetinput box
    if (value === "" || value < 0) {
      this.budgetFeedback.classList.add('showItem') //it will show the item that is hiddin 
      this.budgetFeedback.innerHTML = `<p>value cannot be empty or negative</p>`; //provide a message that it will not work if correct items are not provdied . 
      const self = this; //because we need to use this in the scope below we have to reassigned it so it is available to use in the set timeout function 
      setTimeout(function () {
        self.budgetFeedback.classList.remove('showItem'); //we are going to remove the budgetfeed back div after 4 seconds. 
      }, 4000);
    } else {
      this.budgetAmount.textContent = value; //so the caputures value from the form is now added as text to the budget amount section. 
      this.budgetInput.value = ''; //this budget input form is now cleared. 
      this.showBalance(); //this method we will caluclated the expenses
    }
  }

  submitExpenseForm() {
    const expenseValue = this.expenseInput.value;
    const amountValue = this.amountInput.value;
    if (expenseValue === '' || amountValue === '' || amountValue < 0) {
      this.expenseFeedback.classList.add('showItem');
      this.expenseFeedback.innerHTML = `<p> Values cannot be empty or negative </p>`;
      const self = this;
      setTimeout(function () {
        self.expenseFeedback.classList.remove('showItem');
      }, 4000)
    } else {
      let amount = parseInt(amountValue);
      this.expenseInput.value = '';
      this.amountInput.value = '';

      let expense = {
        id: this.itemID,
        title: expenseValue,
        amount: amount
      }
      this.itemID++;
      this.itemList.push(expense);
      this.addExpense(expense);
      this.showBalance();
    }
  }
  //add expense, creating a div so you can see the expenses being added
  addExpense(expense) {
    const div = document.createElement('div');
    div.classList.add('expense');
    div.innerHTML = `<div class="expense-item d-flex justify-content-between align-items-baseline">

         <h6 class="expense-title mb-0 text-uppercase list-item">- ${expense.title}</h6>
         <h5 class="expense-amount mb-0 list-item">${expense.amount} </h5>

         <div class="expense-icons list-item">

          <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
           <i class="fas fa-edit"></i>
          </a>
          <a href="#" class="delete-icon" data-id="${expense.id}">
           <i class="fas fa-trash"></i>
          </a>
         </div>
        </div> `;
    this.expenseList.appendChild(div);

  }


  //shows balance
  showBalance() {
    const expense = this.totalExpense();
    const total = parseInt(this.budgetAmount.textContent) - expense;
    this.balanceAmount.textContent = total; //shows the total balance then setting up if/else conditions
    if (total < 0) {
      this.balance.classList.remove('showGreen', 'showBlack');
      this.balance.classList.add('showRed');

    } else if (total > 0) {
      this.balance.classList.remove('showRed', 'showBlack');
      this.balance.classList.add('showGreen');

    } else if (total === 0) {
      this.balance.classList.remove('showRed', 'showGreen');
      this.balance.classList.add('showBlack');
    }
  }
  //total expense 
  totalExpense() {
    let total = 0;
    if (this.itemList.length > 0) {
      total = this.itemList.reduce(function (acc, curr) {
        acc += curr.amount;
        return acc;
      }, 0);
    }
    this.expenseAmount.textContent = total;
    return total;

  }
  //edit expense
  editExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    //remove from DOM
    this.expenseList.removeChild(parent);
    //remove from list
    let expense = this.itemList.filter(function (item) {
      return item.id === id;

    })
    //show value
    this.expenseInput.value = expense[0].title;
    this.amountInput.value = expense[0].amount;
    //remove from list
    let tempList = this.itemList.filter(function (item) {
      return item.id !== id;

    })
    this.itemList = tempList;
    this.showBalance();
  }
  //delete expense
  deleteExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    this.expenseList.removeChild(parent);
    let tempList = this.itemList.filter(function (item) {
      return item.id !== id;

    })
    this.itemList = tempList;
    this.showBalance();
  }
}

//run this as DOMCONTENT LOADS, listening 3 things in event listeners function like the budgetform, expense form, expense list 
function eventListeners() {
  const budgetForm = document.getElementById('budget-form');
  const expenseForm = document.getElementById('expense-form');
  const expenseList = document.getElementById('expense-list');
  //new instance of UI Class - 
  const ui = new UI(); //now we hvae access to all the properties 

  //budget form submit 
  budgetForm.addEventListener('submit', function (event) {
    event.preventDefault();
    ui.submitBudgetForm();
  });
  //expense form submit button 
  expenseForm.addEventListener('submit', function (event) {
    event.preventDefault();
    ui.submitExpenseForm();
  });
  //expense list click 
  expenseList.addEventListener('click', function (event) {
    if (event.target.parentElement.classList.contains('edit-icon')) {
      ui.editExpense(event.target.parentElement);
    } else if (event.target.parentElement.classList.contains('delete-icon')) {
      ui.deleteExpense(event.target.parentElement);
    }

  });

}

document.addEventListener('DOMContentLoaded', function () {
  eventListeners();

})