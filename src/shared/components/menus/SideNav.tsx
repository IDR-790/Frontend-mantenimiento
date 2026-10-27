import { Button } from 'primereact/button';
import { MenuItem, MenuItemCommandEvent } from 'primereact/menuitem';
import { PanelMenu, PanelMenuProps } from 'primereact/panelmenu';
import { Sidebar } from 'primereact/sidebar';
import React, { useEffect, useState } from 'react'



type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    initialContent?: JSX.Element | JSX.Element[]
    finalContent?: JSX.Element | JSX.Element[]
    activeItemClassName?: string
    panelMenu?: PanelMenuProps
} 


export const SideNav = ({
    initialContent,
    finalContent,
    panelMenu,
    ...rest
}: Props) => {
    const [items, setItems] = useState<MenuItem[]>([])
    const [expandedKeys, setExpandedKeys] = useState({});

    useEffect(() => {
        panelMenu?.model && setItems(panelMenu.model)
    }, [panelMenu?.model])
    useEffect(() => {
        expandAll()
    }, [items])

    const expandAll = () => {
        items.forEach(expandNode);
        setExpandedKeys(prev => ({ ...prev }));
    };

    const collapseAll = () => {
        setExpandedKeys({});
    };

    const expandNode = (node) => {
        if (node.items && node.items.length) {
            expandedKeys[node.key] = true;

            node.items.forEach(expandNode);
        }
    };


    const [visible, setVisible] = useState(false)
    
    
    return (
    <>
        <div className="w-18rem min-h-screen hidden sm:block" {...rest}>
            { initialContent && initialContent }
            <PanelMenu expandedKeys={expandedKeys} className='w-18rem' {...panelMenu} />
            { finalContent && finalContent }
        </div>

        <div 
            onClick={() => setVisible(true)} 
            className='sticky bg-primary p-2 flex-start flex-column py-5 gap-3 cursor-pointer sm:hidden'
            style={{top: '0', minHeight: 'calc(100vh - 4rem)'}} 
        >
            <i className='pi pi-table' style={{fontSize: '2rem'}} />
            <i className='pi pi-file'  style={{fontSize: '2rem'}} />
        </div>
        <Sidebar visible={visible} onHide={() => setVisible(false)}>
            <div className="w-full" {...rest}>
                { initialContent && initialContent }
                <PanelMenu expandedKeys={expandedKeys} {...panelMenu} />
                { finalContent && finalContent }
            </div>
        </Sidebar>
    </>
    )
}
