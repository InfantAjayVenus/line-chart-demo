import { useEffect, useRef } from "react";
import * as d3 from 'd3';
import { DataRecordType } from "../data/dataRecordType";
import './Charts.css';

export interface ChartProps {
    data: DataRecordType[],
    dimensions: {
        width: number,
        height: number
    },
    margins: {
        top: number,
        bottom: number,
        left: number,
        right: number,
    }
};

export function Chart({
    data,
    dimensions,
    margins: {
        top,
        left,
        right,
        bottom
    }
}: ChartProps) {
    const svgRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const zoom = d3
            .zoom()
            .scaleExtent([1, 10])
            .on('zoom', ({ transform }) => {
                x
                    .domain(transform.rescaleX(x2).domain())
                    .range([left, dimensions.width - right].map(d => transform.applyX(d)));

                chartLine.selectChildren().remove();
                chartLine
                    .attr('d', line);
                
                plotPoints
                    .attr('cx', (d) => x(d.timestamp))

                xAxis.call(
                    d3
                        .axisBottom<Date>(x)
                        .tickFormat(d3.timeFormat('%H:%M:%S'))
                        .ticks(transform.k * 7)
                ).attr('transform', `translate(${0}, ${dimensions.height - bottom})`)
            })

        const x = d3.scaleUtc(
            d3.extent(data.map(item => item.timestamp)).reverse() as Iterable<Date>,
            [left, dimensions.width - right],

        );

        const x2 = d3.scaleUtc(
            d3.extent(data.map(item => item.timestamp)).reverse() as Iterable<Date>,
            [left, dimensions.width - right],

        );
        const y = d3.scaleLinear(d3.extent(data.map((item) => item.value)) as Iterable<d3.NumberValue>, [dimensions.height - bottom, top]);
        const line = d3.line((d: DataRecordType) => x(d.timestamp), (d: DataRecordType) => y(d.value));

        const svg = d3
            .select(svgRef.current)
            .append('svg')
            .attr('width', dimensions.width - (left + right))
            .attr('height', dimensions.height)
            .call(zoom as any)
            .append('g')
            // .attr('transform', `translate(${left}, ${top})`)

        const tooltip = d3.select(tooltipRef.current);
        const tooltipRect = tooltipRef.current!.getBoundingClientRect();
        const tooltipXOffset = parseInt((tooltipRect.width / 2).toString());

        // y-axis
        svg
            .append("g")
            .attr("transform", `translate(${left - 1},0)`)
            .call(d3.axisLeft(y));

        // y-axis grid lines
        svg
            .append('g')
            .attr('class', 'grid stroke-slate-300')
            .call(
                d3
                    .axisLeft(y)
                    .tickSize(-(dimensions.width - (left + right)))
            )
            .attr('transform', `translate(${left}, ${0})`);


        // x-axis
        const xAxis = svg
            .append('g')
            .call(d3.axisBottom<Date>(x).tickFormat(d3.timeFormat('%H:%M:%S')))
            .attr("clip-path", "url(#clip)") // add the clip path!
            .attr('transform', `translate(0, ${dimensions.height - bottom})`)

        // Chart line
        const chartLine = svg
            .append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('clip-path', 'url(#clip)')
            .attr('d', line(data));

        // Chart Circles
        const plotPoints = svg
            .append('g')
            .attr('clip-path', 'url(#clip)')
            .selectAll('circle')
            .data(data)
            .join('circle')
            .attr('class', 'dot')
            .attr('r', 5)
            .attr('cx', (d: DataRecordType) => x(d.timestamp))
            .attr('cy', (d: DataRecordType) => y(d.value))
            .on('pointerover', (event) => {
                const [xPos, yPos] = d3.pointer(event);
                tooltip
                    .style('opacity', 1)
                    .html(
                        `
                            <p>
                                ${d3.timeFormat('%d/%m/%Y %H:%M:%S')(x.invert(xPos))}
                            </p>
                            <strong>${Math.ceil(y.invert(yPos))}</strong>
                        `
                    )
                    .style('left', `${xPos + tooltipXOffset}px`)
                    .style('top', `${yPos - 15}px`);
            })
            .on('pointerleave', () => {
                tooltip
                    .style('opacity', 0);
            })


        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("x", 0)
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)
            .attr('x', left)
    }, []);

    return (
        <>
            <div ref={svgRef} />
            <div className="tooltip" ref={tooltipRef} />
        </>
    );
}