import { useEffect, useRef, useState } from "react";

const SelectFilters = ({ label, options, value, setFilters, filters }: { label: string, options: string[], value: string, setFilters: any, filters: any }) => {

    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null);

    const seleccionar = (e: any, valor: string) => {
        e.preventDefault();
        e.stopPropagation();
        valor = valor
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Esto elimina los acentos físicamente
            .replace(/\s+/g, "-");

        setFilters((prev: any) => {
            const listaActual = prev[value];

            // Si el valor ya está, lo quitamos (toggle), si no, lo agregamos
            const nuevaLista = listaActual.includes(valor)
                ? listaActual.filter((item: any) => item !== valor)
                : [...listaActual, valor];

            return {
                ...prev,
                [value]: nuevaLista
            };
        });
        setOpen(true)
    }

    useEffect(() => {
        const clickAfuera = (e: any) => {
            // Si el clic NO fue dentro del div que contiene todo, cerramos
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', clickAfuera);
        }
        return () => document.removeEventListener('mousedown', clickAfuera);
    }, [open]);

    return (
        <div className="filter_group">
            <div className="select_wrapper" ref={containerRef}>
                <button onClick={() => setOpen(!open)}>
                    {filters[value].length > 0 ? `${filters[value].length} seleccionados` : label}
                </button>
                {open && (
                    <ul className="select_options">
                        {options.map((option) => (
                            <li className={`p-2 ${filters[value]?.includes(option) ? 'active' : ''}`} key={option} onClick={(e) => seleccionar(e, option)}>
                                {option}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default SelectFilters;
