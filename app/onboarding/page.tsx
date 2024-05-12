import { auth } from "@clerk/nextjs/server";

export default async function UserForm() {
    console.log(auth().sessionClaims?.onboarded)
    return (
      <form >
        <label htmlFor="name">名前</label>
        <input type="text" id="name" defaultValue="" required name="name" />
        <button>作成</button>
      </form>
    );
  }