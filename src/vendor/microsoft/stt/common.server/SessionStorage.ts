import { ArgumentNullError, IKeyValueStorage } from "../common/Exports";
import { SimulatedStorage } from "./SimulatedStorage"

export class SessionStorage implements IKeyValueStorage {

    private storage: SimulatedStorage;

    constructor() {
        this.storage = new SimulatedStorage();
    }

    public Get = (key: string): string => {
        if (!key) {
            throw new ArgumentNullError("key");
        }

        return this.storage.getItem(key);
    }

    public GetOrAdd = (key: string, valueToAdd: string): string => {
        if (!key) {
            throw new ArgumentNullError("key");
        }

        const value = this.storage.getItem(key);
        if (value === null || value === undefined) {
            this.storage.setItem(key, valueToAdd);
        }

        return this.storage.getItem(key);
    }

    public Set = (key: string, value: string): void => {
        if (!key) {
            throw new ArgumentNullError("key");
        }

        this.storage.setItem(key, value);
    }

    public Remove = (key: string): void => {
        if (!key) {
            throw new ArgumentNullError("key");
        }

        this.storage.removeItem(key);
    }
}
