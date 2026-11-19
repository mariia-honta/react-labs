/**
 * Показує перші `step` елементів з `items` і кнопку, що показує наступні.
 *
 * Використання:
 *   <ShowMore items={reviews} step={3}>
 *     {(visibleItems) => <ul>…</ul>}
 *   </ShowMore>
 *
 * Вимоги — у тестах tests/ShowMore.test.jsx.
 */
import { useState } from 'react'
export default function ShowMore({ items, step, children }) {
  const [count, setCount] = useState(3)
  const visibleReviews = items.slice(0, count)
  const hiddenCount = items.length - visibleReviews.length

  return (
    <>
      {children(visibleReviews)}
      {items.length > step && (
        <button
          type="button"
          className="show-more"
          onClick={() => setCount(hiddenCount > 0 ? count + step : step)}
        >
          {hiddenCount > 0
            ? `Показати ще ${Math.min(step, hiddenCount)}`
            : 'Згорнути'}
        </button>
      )}
    </>
  )
}
