const tasksDOM = document.querySelector(".tasks");
const loadingDOM = document.querySelector(".loading-text");
const formDOM = document.querySelector(".task-form");
const taskInputDOM = document.querySelector(".task-input");
const taskInputAmt = document.querySelector(".task-amt");
const taskInputDate = document.querySelector(".task-date");
const taskInputPerson = document.querySelector(".task-person");
// const taskInpuTtype = document.querySelector(".task-ttype");
// Load tasks from /api/tasks
const showTasks = async () => {
  loadingDOM.style.visibility = "visible";
  try {
    const {
      data: { tasks },
    } = await axios.get("/api/tasks/d");
    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>';
      loadingDOM.style.visibility = "hidden";
      return;
    }
    const allTasks = tasks
      .map((task) => {
        const { completed, _id: taskID, desc, tdate, amt, transtype } = task;
        return `<div class="single-task ${completed && "task-completed"}">
<h5><span><i class="far fa-check-circle"></i></span>${tdate.substring(
          0,
          10
        )} : ${transtype} : ${desc} : ${amt}</h5>
<div class="task-links">



<!-- edit link -->
<a href="task.html?id=${taskID}"  class="edit-link">
<i class="fas fa-edit"></i>
</a>
<!-- delete btn -->
<button type="button" class="delete-btn" data-id="${taskID}">
<i class="fas fa-trash"></i>
</button>
</div>
</div>`;
      })
      .join("");
    tasksDOM.innerHTML = allTasks;
  } catch (error) {
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>';
  }
  loadingDOM.style.visibility = "hidden";
};

showTasks();

// delete task /api/tasks/:id

tasksDOM.addEventListener("click", async (e) => {
  const el = e.target;
  if (el.parentElement.classList.contains("delete-btn")) {
    loadingDOM.style.visibility = "visible";
    const id = el.parentElement.dataset.id;
    try {
      await axios.delete(`/api/tasks/${id}`);
      showTasks();
    } catch (error) {
      console.log(error);
    }
  }
  loadingDOM.style.visibility = "hidden";
});

// form

formDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  const desc = taskInputDOM.value;
  const amt = taskInputAmt.value;
  const tdate = taskInputDate.value;
  const transtype = taskInputPerson.value;
  const year = Number(tdate.substring(0, 4));
  const month = Number(tdate.substring(5, 7));
  const year_month = tdate.substring(5, 7) + "_" + tdate.substring(0, 4);
  const date_string =
    tdate.substring(8, 10) +
    "_" +
    tdate.substring(5, 7) +
    "_" +
    tdate.substring(0, 4);
  const person = taskInputPerson.value;
  // const transtype = taskInputPerson.value;
  try {
    await axios.post("/api/tasks", {
      desc,
      tdate,
      amt,
      year,
      month,
      transtype,
      year_month,
      date_string,
    });
    showTasks();
    taskInputDOM.value = "";
    taskInputAmt.value = "";
    taskInputDate.value = "";
    taskInputPerson.value = "";
    // taskInputPerson.value = "";
    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = `success, task added`;
    formAlertDOM.classList.add("text-success");
  } catch (error) {
    formAlertDOM.style.display = "block";
    formAlertDOM.innerHTML = `error, please try again`;
  }
  setTimeout(() => {
    formAlertDOM.style.display = "none";
    formAlertDOM.classList.remove("text-success");
  }, 3000);
});
