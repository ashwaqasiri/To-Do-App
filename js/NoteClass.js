class Notes{
    dbVersion=4;
    dbName='Notesdb';
    reverseOrder=false;

    connect(){
     return new Promise((resolve,reject)=>{
      let request=indexedDB.open(this.dbName,this.dbVersion);
      request.onupgradeneeded= () => {
          let db=request.result;      //object of db
          if (!db.objectStoreNames.contains('Notes')){
              db.createObjectStore('Notes',{keyPath:'id' , autoIncrement:true});
            }
        }

      request.onsuccess=()=> resolve(request.result)//object in db
      request.onerror=()=>   reject(request.error.message);
      request.onblocked=()=> console.log('blocked');
    });
    }

    async accessStore(accessType){
     let connect = await this.connect();
     let tx = connect.transaction('Notes',accessType);
     return tx.objectStore('Notes');
    }

    async add(note){
      let store= await this.accessStore('readwrite');   
      return store.add(note);
    }

   async delete(noteId){
      let store = await this.accessStore('readwrite');
      return store.delete(noteId);
    }

    async update(note){
      let store = await this.accessStore('readwrite');
      return store.put(note);
    }

   async all(){
     let store = await this.accessStore('readonly');
     return store.openCursor(null, this.reverseOrder?'prev' : 'next');
    }

   async clear(){
    let store = await this.accessStore('readwrite');
    return store.clear();
    }

}