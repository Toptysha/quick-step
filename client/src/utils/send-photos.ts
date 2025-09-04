export const sendPhotos = async (isAdmin: boolean, files: File[], relativePath: string, filenames: string[]) => {
  
  if (!isAdmin) {
    console.warn("❗ Нет прав доступа");
    return;
  }

  if (files.length === 0 || filenames.length !== files.length) {
    console.warn("❗ Несовпадение количества файлов и имён");
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileName = filenames[i];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("customPath", relativePath);  // new
    formData.append("customName", fileName);      // new

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Ошибка при загрузке файла");

      const data = await res.json();
      console.log("✅ Загружено:", data.url);
    } catch (err) {
      console.error("❌ Ошибка загрузки:", err);
    }
  }
};
