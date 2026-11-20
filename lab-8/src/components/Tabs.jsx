/**
 * Вкладки — складений компонент (compound component): `Tabs` і його частини
 * `Tabs.List`, `Tabs.Tab` і `Tabs.Panel`. Вміст кожної частини приходить між
 * її тегами як `children`, а яка вкладка обрана, частини дізнаються з
 * контексту, який створює `Tabs`.
 *
 * Використання:
 *   <Tabs defaultValue="brew">
 *     <Tabs.List aria-label="Про каву">
 *       <Tabs.Tab value="brew">Заварювання</Tabs.Tab>
 *       <Tabs.Tab value="reviews">Відгуки</Tabs.Tab>
 *     </Tabs.List>
 *     <Tabs.Panel value="brew">…</Tabs.Panel>
 *     <Tabs.Panel value="reviews">…</Tabs.Panel>
 *   </Tabs>
 *
 * Вимоги — у тестах tests/Tabs.children.test.jsx і tests/Tabs.a11y.test.jsx.
 */
import { createContext, use, useState, useId } from 'react'

const TabsContext = createContext(null)

function useTabs() {
  const tabs = use(TabsContext)
  if (tabs === null) {
    throw new Error('Tabs.Tab і Tabs.Panel працюють лише всередині <Tabs>')
  }
  return tabs
}

export default function Tabs({ defaultValue, children }) {
  const [selected, setSelected] = useState(defaultValue)
  const baseId = useId()

  return (
    <TabsContext value={{ selected, setSelected, baseId }}>
      <div className="tabs">{children}</div>
    </TabsContext>
  )
}

function TabsList({ children, ...props }) {
  return (
    <div role="tablist" className="tab-list" {...props}>
      {children}
    </div>
  )
}

function TabsTab({ value, children }) {
  const { selected, setSelected, baseId } = useTabs()
  const isSelected = selected === value

  function handleKeyDown(e) {
    const list = e.currentTarget.closest('[role="tablist"]')
    const tabs = [...list.querySelectorAll('[role="tab"]')]
    const index = tabs.indexOf(e.currentTarget)

    let next
    if (e.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length]
    else if (e.key === 'ArrowLeft')
      next = tabs[(index - 1 + tabs.length) % tabs.length]
    else if (e.key === 'Home') next = tabs[0]
    else if (e.key === 'End') next = tabs[tabs.length - 1]
    else return

    e.preventDefault()
    next.focus()
    next.click()
  }
  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={isSelected}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={isSelected ? 0 : -1}
      onClick={() => setSelected(value)}
      onKeyDown={handleKeyDown}
    >
      {children}
    </button>
  )
}

function TabsPanel({ value, children }) {
  const { selected, baseId } = useTabs()

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      hidden={selected !== value}
    >
      {children}
    </div>
  )
}

Tabs.List = TabsList
Tabs.Tab = TabsTab
Tabs.Panel = TabsPanel
