




export interface User{
    id:string;
    username:string;
    avatar:string;

  
  }
  
export interface Post{
  id:string;
  parent_id?:string | null;
  user_id:string;
  text:string;
 file?:string|null
  created_at?:string;
  User?:User;
  Post?:Post[];
  tag_name?:string| null
  }
  export interface Place{
    id:string;
   name:string
   latitude:number
   longitude:number
   address:string
   created_at:Date
    }
  export interface Tag{

    name:string
  }