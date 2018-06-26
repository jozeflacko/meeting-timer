import Person from '../interfaces/Person';
import Status from '../interfaces/Status';
import ColorFactory from '../factories/ColorFactory';
import store, { CHANGE_PERSONS } from '../store'; 
import { STATUS_CODES } from 'http';


/**
 * This is a stateless service
 */
export default class PersonService {

    private findIndex(person: Person): number {
        return store.state.persons.indexOf(person);
    }

    private contains(person: Person): boolean {
        return this.findIndex(person) > -1;
    }

    public static createPerson(): Person {

        const p: Person = {
            name: '',
            image: '',
            talking: false,
            currentTimeInSeconds : '',
            favoriteColor: '',
        };

        return p;
    }

    public save(persons: Person[]) {
        store.commit(CHANGE_PERSONS, persons);
    }

    public change(person: Person, new_person: Person) {
        const index = this.findIndex(person);
        if (index > -1) {
           const persons = store.state.persons.splice(0);
           persons[index] = new_person;

           this.save(persons);
        }
    }

    public getSize(): number {
        return store.state.persons.length;
    }

    public addNew(person: Person): void {
        const copy = this.createCloneOfPersons();
        copy.push(person);
        store.commit(CHANGE_PERSONS, copy);
    }

    public add(name: string, image: string): void {

        const talking: boolean = false;
        const currentTimeInSeconds: string = '0'; 
        const favoriteColor: string = ColorFactory.getRandomColor();

        const person: Person = {
            name,
            image, 
            talking,
            currentTimeInSeconds,
            favoriteColor,
        };

        if (this.findByName(name) === null) {
            const copy = this.createCloneOfPersons();
            copy.push(person);
            store.commit(CHANGE_PERSONS, copy);
        } else {
            throw new Error('Already exising');
        }
    }

    private createCloneOfPersons(): Person[] {
        return store.state.persons.slice(0);
    }


    public findByName(name: string) {
        
        let result: Person|null = null;
        store.state.persons.forEach((person: Person) => {
            if (person.name === name) {
                result = person;
            }
        });

        return result;
    }

    public remove(person: Person) {        
        const index = this.findIndex(person);
        const copy = this.createCloneOfPersons();      
        copy.splice(Number(index), 1);
        store.commit(CHANGE_PERSONS, copy);
    }

    public removeByName(name: string) {
        
        const person = this.findByName(name);        
        if (person !== null) {
            this.remove(person);
        } else {
            throw new Error('Person does not exist');
        }
    }
}

