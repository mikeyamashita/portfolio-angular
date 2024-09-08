import { Link } from "./link";

export class Project {
    id: number | undefined;
    name: string | undefined;
    startdate: Date | undefined;
    enddate: Date | undefined;
    description: string | undefined;
    image: string | undefined;
    imageUrl: string | undefined;
    tags: Array<string> | undefined;
    links: Array<Link> | undefined;
    gallery: Array<string> | undefined;
    url: number | undefined;
    type: number | undefined;
}