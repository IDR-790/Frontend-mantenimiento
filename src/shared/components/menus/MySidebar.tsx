import { useState } from 'react'
import './style.css'
import { Sidebar } from 'primereact/sidebar'


export interface MenuItem {
    id: string
    label?: string
    icon?: string | JSX.Element
    content?: JSX.Element    // |JSX.Element[]
    expanded?: boolean
    command?: (e: any) => void
    className?: string
    style?: string
    items?: MenuItem[]
}

interface Props {
    items: MenuItem[]
    activeClassName?: string,
    menuHeaderForPhones?: JSX.Element,
    defaultItemActive?: string
}


export const MySidebar = ({ items, activeClassName, menuHeaderForPhones, defaultItemActive }: Props) => {
    const [activeItemId, _setActiveItemId] = useState(defaultItemActive || "")
    const setActiveItemId = (id: string) => { _setActiveItemId(id) }
    const [visible, setVisible] = useState(false)


    return (
        <>
            {/* For large screens */}
            <ul className='menu-sidebar bg-gray-100 hidden md:block' style={{ minWidth: '18rem', minHeight: 'calc(100vh - 4rem)' }}>
                {
                    items.map(item => <MenuItem key={item.id} item={item} isHeader activeClassName={activeClassName} activeItemId={activeItemId} setActiveItemId={setActiveItemId} />)
                }
            </ul>

            {/* For phone screens */}
            <div onClick={() => setVisible(true)} className='bg-gray-200 mr-1 py-4 flex flex-column gap-3 md:hidden' style={{ height: 'calc(100vh - 4rem)' }}>
                {items.map(i => {

                    if (typeof i.icon == 'string') return <i key={`${i.id}-icon`} className={`pi ${i.icon}`} style={{ fontSize: '1.5rem' }} />

                    return i.icon
                })}
            </div>
            <Sidebar visible={visible} onHide={() => setVisible(false)} className='min-w-max bg-gray-100' header={menuHeaderForPhones}>
                <ul className='menu-sidebar bg-gray-100' style={{ minWidth: '18rem' }}>
                    {
                        items.map(item => <MenuItem key={item.id} item={item} isHeader activeClassName={activeClassName} activeItemId={activeItemId} setActiveItemId={setActiveItemId} />)
                    }
                </ul>
            </Sidebar>
        </>
    )
}


interface Props2 {
    item: MenuItem
    activeItemId: string,
    setActiveItemId: (id: string) => void
    isHeader?: boolean
    activeClassName?: string
}

const MenuItem = ({
    item,
    activeItemId,
    setActiveItemId,
    isHeader,
    activeClassName
}: Props2) => {
    const hasItems = item.items && item.items.length
    const [isExpanded, setIsExpanded] = useState(item.expanded)

    const handleClic = () => {
        if (!hasItems) {
            setActiveItemId(item.id)
        }
        setIsExpanded(prev => !prev)
        !!item.command ? item.command('missing something here') : undefined
    }

    return (
        <>
            <li
                className={`flex align-items-center bg-gray-${isHeader ? '100' : '100'} py-3 ${isHeader ? 'pl-3' : 'pl-5'} cursor-pointer ${isHeader ? '' : 'fadeinleft animation-duration-200'}  ${item.className} hover:bg-gray-300 `}
                onClick={handleClic}
                style={activeItemId == item.id ? JSON.parse(activeClassName!) : null}>
                {item.icon &&
                    typeof item.icon == 'string' ?
                    <i className={`pi ${item.icon} ml-2 mr-3`} />
                    : item.icon
                }
                {item.label}
                {hasItems &&
                    <i className={`ml-auto pr-3 pi pi-angle-${isExpanded ? 'down' : 'right'}`} />
                }
            </li>

            {item.items && item.items.length && isExpanded &&
                <ul>
                    {item.items.map(item => <MenuItem key={item.id} item={item} activeClassName={activeClassName} activeItemId={activeItemId} setActiveItemId={setActiveItemId} />)}
                </ul>
            }
        </>
    )
}