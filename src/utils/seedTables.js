import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const seedTables = async () => {
  const types = [2, 4, 6];
  let tableId = 1;

  for (let type of types) {
    for (let i = 0; i < 10; i++) {
      if (tableId > 26) break;
      const tableData = {
        number: tableId,
        type,
        status: "available",
      };
      await setDoc(doc(collection(db, "tables"), `T${tableId}`), tableData);
      tableId++;
    }
  }
};
