/* ============================================================
   Nivarti — shared script.js
   Handles: portal-card redirection on the landing page, plus
   small interactive behaviors on the user / staff / admin pages.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Landing page: portal card → sub-page redirect ---------- */
  const portalCards = document.querySelectorAll('.portal-card[data-portal]');
  portalCards.forEach(card => {
    const dest = card.getAttribute('data-portal');

    card.addEventListener('click', (e) => {
      // Let the inner <a> handle its own click normally; for clicks
      // elsewhere on the card, navigate via JS.
      if (e.target.closest('a')) return;
      window.location.href = dest;
    });

    // Keyboard accessibility: Enter / Space triggers the same redirect.
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = dest;
      }
    });
  });

  /* ---------- 2. User portal: report form + local ticket list ---------- */
  const reportForm = document.getElementById('report-form');
  if (reportForm) {
    const ticketList = document.getElementById('ticket-list');
    let ticketCounter = 248;

    reportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const category = document.getElementById('category').value;
      const location = document.getElementById('location').value.trim();
      const description = document.getElementById('description').value.trim();
      if (!category || !location || !description) return;

      ticketCounter += 1;
      const li = document.createElement('li');
      li.className = 'ticket-row new';
      li.innerHTML = `
        <span class="ticket-id">#HV-${ticketCounter}</span>
        <span class="ticket-meta">
          <span class="ticket-cat">${category}</span>
          <span class="ticket-loc">${location}</span>
        </span>
        <span class="ticket-status status-open">Open</span>
      `;
      ticketList.prepend(li);
      reportForm.reset();

      const confirmMsg = document.getElementById('form-confirm');
      confirmMsg.textContent = `Ticket #HV-${ticketCounter} logged. You'll get updates as it moves through the queue.`;
      confirmMsg.classList.add('show');
      setTimeout(() => confirmMsg.classList.remove('show'), 4000);
    });
  }

  /* ---------- 3. Staff portal: queue filter + status cycling ---------- */
  const queueFilters = document.querySelectorAll('.queue-filter');
  const workOrderRows = document.querySelectorAll('.work-order[data-category]');
  if (queueFilters.length) {
    queueFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        queueFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        workOrderRows.forEach(row => {
          const match = filter === 'all' || row.getAttribute('data-category') === filter;
          row.style.display = match ? '' : 'none';
        });
      });
    });
  }

  const statusCycle = ['Queued', 'In progress', 'Awaiting parts', 'Resolved'];
  document.querySelectorAll('.status-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pill = btn.closest('.work-order').querySelector('.status-pill');
      const current = statusCycle.indexOf(pill.textContent.trim());
      const next = statusCycle[(current + 1) % statusCycle.length];
      pill.textContent = next;
      pill.className = 'status-pill status-' + next.toLowerCase().replace(/\s+/g, '-');
    });
  });

  /* ---------- 4. Admin portal: category filter for complaints table ---------- */
  const adminFilterSelect = document.getElementById('admin-category-filter');
  const complaintRows = document.querySelectorAll('#complaints-table tbody tr');
  if (adminFilterSelect) {
    adminFilterSelect.addEventListener('change', () => {
      const val = adminFilterSelect.value;
      complaintRows.forEach(row => {
        const match = val === 'all' || row.getAttribute('data-category') === val;
        row.style.display = match ? '' : 'none';
      });
    });
  }

  const reportBtn = document.getElementById('generate-report');
  if (reportBtn) {
    reportBtn.addEventListener('click', () => {
      const note = document.getElementById('report-note');
      const stamp = new Date().toLocaleString();
      note.textContent = `Report snapshot generated at ${stamp}. In the connected build, this exports a PDF/CSV of the current filtered view.`;
      note.classList.add('show');
    });
  }

});
