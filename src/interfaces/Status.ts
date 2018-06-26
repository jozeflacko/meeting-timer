import Person from './Person';

export default interface Status {
    talkingPerson: Person;
    peopleArray: Person[];
    duration: number;
    timeLimit: string;
}
