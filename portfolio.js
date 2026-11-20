const views = {
  priority: {
    label: 'Management priorities',
    image: 'voltiva-overview.png',
    title: 'Executive Overview',
    metrics: [['7.56%', 'Historical stockout rate'], ['64.82%', 'Supplier OTIF']],
    note: 'Prioritize replenishment where availability is low and rebalance stock where the data shows excess.'
  },
  inventory: {
    label: 'Inventory availability and excess',
    image: 'voltiva-inventory.png',
    title: 'Inventory Control',
    metrics: [['26.88%', 'Current zero-stock rate'], ['34.77%', 'Below reorder point rate']],
    note: 'Use the SKU and location breakdown to plan replenishment and inter-location transfers.'
  },
  supplier: {
    label: 'Supplier performance',
    image: 'voltiva-suppliers.png',
    title: 'Supplier Performance',
    metrics: [['64.82%', 'Supplier on-time and in-full rate'], ['99.10%', 'Final fill rate']],
    note: 'Use delivery timing and quantity shortfalls to guide supplier reviews.'
  },
  returns: {
    label: 'Customer returns',
    image: 'voltiva-returns.png',
    title: 'Customer Returns',
    metrics: [['4.28%', 'Return line rate'], ['62.55%', 'Operational reason share']],
    note: 'Review return reasons and the associated refund exposure to decide which issues to investigate first.'
  }
};

const lmsViews = {
  overview: {
    title: 'DigiLians Executive Overview',
    image: 'lms-overview.png',
    width: 1280,
    height: 721,
    note: 'An overview of 138 trainees, their scores and attendance across universities and academic years.'
  },
  performance: {
    title: 'DigiLians Student Performance',
    image: 'lms-performance.png',
    width: 1281,
    height: 722,
    note: 'This view compares attendance with exam scores and shows average scores by lab. Trainee names and individual records are hidden.'
  },
  attendance: {
    title: 'DigiLians Attendance Analysis',
    image: 'lms-attendance.png',
    width: 1282,
    height: 722,
    note: 'Attendance patterns across 50 sessions, with breakdowns by topic, day, instructor and lab.'
  }
};

function initializeTabs(panel, tabs, views) {
  const label = panel.querySelector('.report-label');
  const metrics = panel.querySelector('.metrics');
  const note = panel.querySelector('.view-note');
  const shot = panel.querySelector('.shot');
  const image = shot.querySelector('img');

  function selectTab(tab) {
    const view = views[tab.dataset.view];

    for (const button of tabs) {
      const selected = button === tab;
      button.setAttribute('aria-selected', selected);
      button.tabIndex = selected ? 0 : -1;
    }

    panel.setAttribute('aria-labelledby', tab.id);
    note.textContent = view.note;
    shot.href = view.image;
    shot.setAttribute('aria-label', 'Open ' + view.title + ' screenshot at full size');
    image.src = view.image.replace(/\.png$/, '-preview.jpg');
    image.alt = view.title;
    image.width = view.width ?? 2232;
    image.height = view.height ?? 1286;

    if (label) label.textContent = view.label;
    if (metrics) {
      metrics.replaceChildren(...view.metrics.map(([value, description]) => {
        const card = document.createElement('div');
        const title = document.createElement('strong');
        const detail = document.createElement('span');
        card.className = 'metric';
        title.textContent = value;
        detail.textContent = description;
        card.append(title, detail);
        return card;
      }));
    }
  }

  for (const [index, tab] of tabs.entries()) {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (event) => {
      const targets = {
        ArrowLeft: (index + tabs.length - 1) % tabs.length,
        ArrowRight: (index + 1) % tabs.length,
        Home: 0,
        End: tabs.length - 1
      };

      if (!Object.hasOwn(targets, event.key)) return;
      event.preventDefault();
      const next = tabs[targets[event.key]];
      selectTab(next);
      next.focus();
    });
  }
}

for (const [id, reportViews] of [['voltiva-view', views], ['lms-view', lmsViews]]) {
  const panel = document.getElementById(id);
  const tabs = [...document.querySelectorAll('[aria-controls="' + id + '"]')];
  initializeTabs(panel, tabs, reportViews);
}
