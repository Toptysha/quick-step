export const getAllCovers = async () => {
  const res = await fetch("/api/covers/get-all");
  if (!res.ok) throw new Error("Не удалось получить обложки");
  return res.json();
};

export const uploadCover = async (file: File, type: string, description: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  formData.append("description", description);

  const res = await fetch("/api/covers/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data;
};

export const deleteCover = async (path: string) => {
  const res = await fetch("/api/covers/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });

  const data = await res.json();
  return data;
};
