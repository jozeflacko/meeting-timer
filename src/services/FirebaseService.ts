import firebase from 'firebase';
import store, { CHANGE_STORE } from '../store'; 

export default class FirebaseService {

    private static COLLECTION_NAME = 'stand-up';
    private static userId: string|null = null;
    private static db: any;

    private static config = {
        apiKey: 'AIzaSyCJelLxh1b2f-EV8lsu-uwvqdYMcoIW5uE',
        authDomain: 'stand-up-manager.firebaseapp.com',
        databaseURL: 'https://stand-up-manager.firebaseio.com',
        projectId: 'stand-up-manager',
        storageBucket: 'stand-up-manager.appspot.com',
        messagingSenderId: '82403032916',
    };

    public static init(): void {
        firebase.initializeApp(FirebaseService.config);

        firebase.auth().signInAnonymously().catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            
            alert(errorMessage);
        });

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              // User is signed in.
              const isAnonymous = user.isAnonymous;              
              this.userId = user.uid;
              // ...
            } else {
              // User is signed out.
              this.userId = null;
            }
            // ...
        });

        this.db = firebase.firestore();   
        
        const firestore = firebase.firestore();
        const settings = {/* your settings... */ timestampsInSnapshots: true};
        firestore.settings(settings);

        this.db.collection(FirebaseService.COLLECTION_NAME)
            .onSnapshot((snapshot) => {
                FirebaseService.processSnapshot(snapshot.docs[0].id);
            });
    }

    public static sendInformation(payload: any) {
        FirebaseService.db.collection(FirebaseService.COLLECTION_NAME)
            .add({
                payload, 
                added_at: new Date(),               
            }).then((docRef) => {
                console.log('Document written with ID: ', docRef.id);
            }).catch(function(error) {
                console.error('Error adding document: ', error);
            });
    }

    private static processSnapshot(id: string) {
        this.db.collection(FirebaseService.COLLECTION_NAME).orderBy('added_at', 'desc').limit(1).get().then(function(snapshot) {
            snapshot.forEach((doc) => {
                console.log(doc.id, '=>', doc.data());
                const newStore = doc.data().payload;
                store.commit(CHANGE_STORE, newStore);
                
                for(let p of newStore.peopleArray) {
                    if(p.name === newStore.talkingPerson.name) {
                        console.log(p.name);
                    }
                }
                
            });
        });
    }
}
