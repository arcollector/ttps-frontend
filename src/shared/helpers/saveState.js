import firebase from '../../shared/utils/Firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import moment from 'moment';

const db= firebase.firestore(firebase);

moment.locale('es');



export default function saveState (state, nameEmployee, idMedicExam) {

    let  today = new Date();

    var promise= new Promise (function(resolve,reject){
        
        let day=today.getDate();
        let month=today.getMonth()+1;
        let year=today.getFullYear();
        
        
        db.collection("states").add({
        name:state,
        employee:nameEmployee,
        day:day,
        month:month,
        year:year,
        idMedicExam:idMedicExam,
        }).then(e=>{
            resolve(e.id);
        })
    }
    )

    return promise;

    
}
