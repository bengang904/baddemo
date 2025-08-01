document.getElementById('clearFolder').addEventListener('click', async () => {
    const deletedItemsList = document.getElementById('deletedItemsList');
    deletedItemsList.innerHTML = '';

    try {
      const dirHandle = await window.showDirectoryPicker();
      let deletedCount = 0;

      // 递归删除函数
      async function deleteRecursive(handle) {
        for await (const entry of handle.values()) {
          if (entry.kind === 'file') {
            await handle.removeEntry(entry.name);
            const item = document.createElement('li');
            item.textContent = `已删除文件: ${entry.name}`;
            deletedItemsList.appendChild(item);
            deletedCount++;
          } else if (entry.kind === 'directory') {
            const subDirHandle = await handle.getDirectoryHandle(entry.name);
            await deleteRecursive(subDirHandle);
            await handle.removeEntry(entry.name, { recursive: true });
            const item = document.createElement('li');
            item.textContent = `已删除文件夹: ${entry.name}`;
            deletedItemsList.appendChild(item);
            deletedCount++;
          }
        }
      }

      await deleteRecursive(dirHandle);

      if (deletedCount === 0) {
        deletedItemsList.innerHTML = '<li style="border-left-color: #2196F3;">文件夹已是空的。</li>';
      }

    } catch (err) {
      console.error('清空过程中出错:', err);
      deletedItemsList.innerHTML = `<li style="border-left-color: orange;">发生错误: ${err.message}</li>`;
    }
  });