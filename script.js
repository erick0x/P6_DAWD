// Array para almacenar las notas
let notes = [];

// Función para agregar nueva nota
function addNote() {
    const studentNameInput = document.getElementById('studentName');
    const noteValueInput = document.getElementById('noteValue');
    
    const studentName = studentNameInput.value.trim();
    const noteValue = parseFloat(noteValueInput.value);
    
    // Validaciones
    if (!studentName) {
        alert('Por favor, ingrese el nombre del estudiante');
        return;
    }
    
    if (isNaN(noteValue) || noteValue < 0 || noteValue > 20) {
        alert('Por favor, ingrese una nota válida entre 0 y 20');
        return;
    }
    
    // Agregar nota al array
    const newNote = {
        id: Date.now(),
        student: studentName,
        note: noteValue,
        date: new Date().toLocaleDateString()
    };
    
    notes.push(newNote);
    
    // Limpiar inputs
    studentNameInput.value = '';
    noteValueInput.value = '';
    
    // Actualizar interfaz
    updateNotesList();
    updateStatistics();
    
    // Animación de confirmación
    showNotification('Nota agregada correctamente');
}

// Función para eliminar nota
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    updateNotesList();
    updateStatistics();
    showNotification('Nota eliminada');
}

// Función para actualizar la lista de notas
function updateNotesList() {
    const notesList = document.getElementById('notesList');
    
    if (notes.length === 0) {
        notesList.innerHTML = '<p style="text-align: center; color: #666;">No hay notas registradas</p>';
        return;
    }
    
    notesList.innerHTML = notes.map(note => `
        <li class="note-item ${note.note >= 12 ? 'approved' : 'failed'}">
            <div>
                <strong>${note.student}</strong><br>
                <small>Nota: ${note.note} - ${note.note >= 12 ? '✅ Aprobado' : '❌ Desaprobado'}</small><br>
                <small>📅 ${note.date}</small>
            </div>
            <button class="delete-btn" onclick="deleteNote(${note.id})">Eliminar</button>
        </li>
    `).join('');
}

// Función para actualizar estadísticas
function updateStatistics() {
    const total = notes.length;
    
    if (total === 0) {
        document.getElementById('totalNotes').textContent = '0';
        document.getElementById('average').textContent = '0';
        document.getElementById('highestNote').textContent = '0';
        document.getElementById('lowestNote').textContent = '0';
        document.getElementById('approved').textContent = '0';
        return;
    }
    
    const notesValues = notes.map(n => n.note);
    const sum = notesValues.reduce((a, b) => a + b, 0);
    const average = (sum / total).toFixed(2);
    const highest = Math.max(...notesValues);
    const lowest = Math.min(...notesValues);
    const approved = notes.filter(n => n.note >= 12).length;
    
    document.getElementById('totalNotes').textContent = total;
    document.getElementById('average').textContent = average;
    document.getElementById('highestNote').textContent = highest;
    document.getElementById('lowestNote').textContent = lowest;
    document.getElementById('approved').textContent = approved;
}

// Función para mostrar notificaciones
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #48bb78;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        animation: slideIn 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Cargar datos guardados al iniciar
function loadSavedData() {
    const savedNotes = localStorage.getItem('studentNotes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
        updateNotesList();
        updateStatistics();
    }
}

// Guardar datos automáticamente
function saveData() {
    localStorage.setItem('studentNotes', JSON.stringify(notes));
}

// Guardar antes de cerrar
window.addEventListener('beforeunload', saveData);

// Inicializar aplicación
loadSavedData();

// Autoguardado cada 30 segundos
setInterval(saveData, 30000);