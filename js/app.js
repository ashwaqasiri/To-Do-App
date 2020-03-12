let NotesObj = new Notes();

window.onload = getAll();

$('.newDate').dateDropper();

document.addEventListener('submit',(event) => {
    event.preventDefault();
    let target = event.target;
    if(target && target.classList.contains('add-note')){
        addNote(target);
    }else if(target && target.classList.contains('update-note')){
        let note = {id: parseInt(target.dataset.id) ,
                  text: target.querySelector('input').value ,
                  date: target.querySelector('.editDate').value,
                  complete: false
                };
        updateNote(note);
    }
});

document.addEventListener('click',(event)=>{
    let {target} = event;

    if (target && target.classList.contains('delete')){
       let noteId = parseInt(target.dataset.id);
       deleteNote(noteId);
    }else if (target && target.classList.contains('edit')){
        editNote(target);
          
    }else if( target && target.type=='checkbox'){
        console.log(target.checked);
        let container = document.getElementById('note-'+target.dataset.id);
        let itemDone = container.querySelector('.strikethrough');
        let d = container.querySelector('span');
        let note = {id: parseInt(target.dataset.id),
                   text: itemDone.innerText,
                   date: d.innerText,
               complete: target.checked};
        updateNote(note);
    }
});

document.getElementById('clearAllBtn')
.addEventListener('click',clearAll);

async function addNote(target){
    let text = target.querySelector('.newTask');
    let date = target.querySelector('.newDate');
    let newNote = text.value;
    let newDate = date.value;
    if(newNote.length==0){
        Swal.fire('Please Enter A Valid Task');
    }else{
    let add = await NotesObj.add({text : newNote ,
                                  date : newDate,
                               complete: false  });
    add.onsuccess = () =>{
       getAll();
       text.value = '';
       date.value = '';
    }
  }   
}

async function deleteNote(noteId){
    let deleteRequest = await NotesObj.delete(noteId);
        deleteRequest.onsuccess = ()=> {
        document.getElementById('note-'+ noteId).remove();
      }
      return false;
}

function editNote(note){
    let container = document.getElementById('note-'+note.dataset.id);
    let oldText   = container.querySelector('.strikethrough').innerText;
    let oldDate   = container.querySelector('span').innerText;
    let form = `<form class = "update-note" data-id = "${note.dataset.id}">
                <input type="text" value="${oldText}"  >
                <input type="text" class="editDate" value="${oldDate}"  >
                <button class="btn done" type="submit">Done</button>
                </form>`
    container.innerHTML = form;
}

async function updateNote(note){
    let updateRequest = await NotesObj.update(note);
    updateRequest.onsuccess = getAll();
}

async function getAll(){
   let request = await NotesObj.all();  
   let notesArray=[];
   request.onsuccess = () =>{
       let curser = request.result;
       if(curser){
           notesArray.push(curser.value);
           curser.continue();
       }else{
        displayNotes(notesArray)
           
       }
    }
}

var allNotes =  document.getElementById('notes');
function displayNotes(Notes){
    console.log(Notes);
    let box = document.createElement('div');
    for(let i = 0; i < Notes.length; i++){
        let list = document.createElement('li');
        var note = Notes[i];
        list.className = 'item';
        list.id = 'note-'+note.id;
        var checked = (note.complete == 1)? 'checked="checked"': '';
        list.innerHTML = `
        <input type="checkbox" name="item_complete" id="chb-${note.id}" data-id="${note.id}" ${checked} >
        <label class="strikethrough">${note.text}</label><span> ${note.date}</span>
        <div class = "icon">
        <i class="fas fa-edit edit"    data-id="${note.id}"></i>
        <i class="fas fa-trash delete" data-id="${note.id}"></i>
        </div>`;
        box.append(list);
    }
    allNotes.innerHTML='';
    allNotes.append(box);
}

async function clearAll(){
    let request = await NotesObj.clear();
    request.onsuccess = () => {
        allNotes.innerHTML = '';
    }
}

/*document.getElementById('chb-'+ note.id).onchange= function(e) {


    }*/