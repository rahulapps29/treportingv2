const taskIDDOM = document.querySelector(".task-edit-id");
const taskDescDOM = document.querySelector(".task-edit-desc");
const taskPersonDOM = document.querySelector(".task-edit-person");
const taskAmtDOM = document.querySelector(".task-edit-amt");
const taskDateDOM = document.querySelector(".task-edit-date");
const taskCompletedDOM = document.querySelector(".task-edit-completed");
const editFormDOM = document.querySelector(".single-task-form");
const editBtnDOM = document.querySelector(".task-edit-btn");
const formAlertDOM = document.querySelector(".form-alert");
const params = window.location.search;
const id = new URLSearchParams(params).get("id");
let tempDesc;

const showTask = async () => {
  try {
    const {
      data: { task },
    } = await axios.get(`/api/tasks/${id}`);
    const { _id: taskID, completed, desc, amt, tdate, transtype } = task;

    taskIDDOM.textContent = taskID;
    taskPersonDOM.value = transtype;
    taskDescDOM.value = desc;
    taskAmtDOM.value = amt;
    taskDateDOM.valueAsDate = new Date(tdate);
    if (completed) {
      taskCompletedDOM.checked = true;
    }
  } catch (error) {
    console.log(error);
  }
};

showTask();

editFormDOM.addEventListener("submit", async (e) => {
  editBtnDOM.textContent = "Loading...";
  e.preventDefault();
  try {
    const taskPerson = taskPersonDOM.value;
    const taskDesc = taskDescDOM.value;
    const taskCompleted = taskCompletedDOM.checked;
    const taskAmt = taskAmtDOM.value;
    const taskDate = taskDateDOM.value;
    const date_string =
      taskDate.substring(8, 10) +
      "_" +
      taskDate.substring(5, 7) +
      "_" +
      taskDate.substring(0, 4);
    const {
      data: { task },
    } = await axios.patch(`/api/tasks/${id}`, {
      desc: taskDesc,
      completed: taskCompleted,
      amt: taskAmt,
      tdate: taskDate,
      transtype: taskPerson,
      date_string: date_string,
    });

    const { _id: taskID, completed, desc, amt, tdate, transtype } = task;

    taskIDDOM.textContent = taskID;
    taskDescDOM.value = transtype;
    taskPersonDOM.value = desc;
    taskAmtDOM.value = amt;
    taskDateDOM.value = tdate;
    tempDesc = desc;
    if (completed) {
      taskCompletedDOM.checked = true;
    }
    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = `success, edited task`;
    formAlertDOM.classList.add("text-success");
  } catch (error) {
    console.error(error);
    taskDescDOM.value = tempDesc;
    formAlertDOM.style.display = "block";
    formAlertDOM.innerHTML = `error, please try again`;
  }
  editBtnDOM.textContent = "Edit";
  setTimeout(() => {
    formAlertDOM.style.display = "none";
    formAlertDOM.classList.remove("text-success");
  }, 3000);
});
