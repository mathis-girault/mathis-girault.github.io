export default function loadFile() {
  return new Promise((resolve, reject) => {
    fetch("./infos.txt")
      .then((response) => response.text())
      .then((fileContent) => {
        const lines = fileContent.split("\n");
        const infos = [];
        const regex = /^(.*?)\s*:\s*(cesure|stage)\s*:\s*(.*?)$/;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();

          if (line === "" || line.startsWith("#")) {
            continue;
          }

          const matches = line.match(regex);

          if (matches && matches.length == 4) {
            const name = matches[1].trim();
            const isStage = matches[2].trim() === "stage";
            const city = matches[3].trim();

            infos.push({
              name,
              isStage,
              city,
            });
          }
        }

        resolve(infos); // Resolve the promise with the parsed information
      })
      .catch((error) => {
        console.log("Error:", error);
        reject(error); // Reject the promise with the error
      });
  });
}
