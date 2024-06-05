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
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const x = d3.scaleUtc(
            d3.extent(data.map(item => item.timestamp)).reverse() as Iterable<Date>,
            [left, dimensions.width - right],

        );

        const y = d3.scaleLinear(d3.extent(data.map((item) => item.value)) as Iterable<d3.NumberValue>, [dimensions.height - bottom, top]);

        const line = d3.line((d: DataRecordType) => x(d.timestamp), (d: DataRecordType) => y(d.value));
        const svg = d3.select(svgRef.current);

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
        svg
            .append('g')
            .attr("transform", `translate(0,${dimensions.height - bottom})`)
            .call(
                d3.axisBottom<Date>(x)
                    .tickFormat(d3.timeFormat('%H:%M:%S'))
            );

        // Chart line
        svg
            .append('path')
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr('stroke-width', 1.5)
            .attr('d', line(data));

        // Chart Circles
        svg
            .append('g')
            .selectAll('circle')
            .data(data)
            .join('circle')
            .attr('r', 5)
            .attr('cx', (d: DataRecordType) => x(d.timestamp))
            .attr('cy', (d: DataRecordType) => y(d.value))
            .attr('fill', 'steelblue')

    }, []);

    return (
        <svg ref={svgRef} {...dimensions} />
    );
}