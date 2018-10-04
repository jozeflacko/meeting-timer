import Person from '../interfaces/Person';
import Status from '../interfaces/Status';
import ColorFactory from '../factories/ColorFactory';
import store, { CHANGE_PERSONS } from '../store'; 
import { STATUS_CODES } from 'http';
import ImageService from '../services/ImageService';


/**
 * This is a stateless service
 */
export default class PersonService {

    private imageService = new ImageService();

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

    public removeAll() {
        store.commit(CHANGE_PERSONS, []);
    }

    public removeByName(name: string) {
        
        const person = this.findByName(name);        
        if (person !== null) {
            this.remove(person);
        } else {
            throw new Error('Person does not exist');
        }
    }

    public createDefaultPeople() {
        const personService = new PersonService();    

        this.removeAll();

        this.add('Federico',    this.imageService.getImage(4));
        this.add('Matheus',     this.imageService.getImage(5));
        this.add('Gabriel',     this.imageService.getImage(0));
        this.add('Ognjen',      this.imageService.getImage(7));
        this.add('Stefan',      this.imageService.getImage(8));
        this.add('Samuel',      this.imageService.getImage(10));
        this.add('Jozef',       this.imageService.getImage(3));
        this.add('Fritz',       this.imageService.getImage(1));
        this.add('Inge',        this.imageService.getImage(9));
        this.add('Abduaziz',        this.imageService.getImage(2));
        this.add('Adrian',        this.imageService.getImage(10));
    }
}

