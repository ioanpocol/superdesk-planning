import React from 'react';
import {mount} from 'enzyme';
import {RepeatEventSummary} from './index';
import moment from 'moment';

describe('<RepeatEventSummary />', () => {
    const event = {
        _id: '5800d71930627218866f1e80',
        dates: {
            start: moment('2016-10-15T14:30+0000'),
            end: moment('2016-10-20T15:00+0000'),
        },
        definition_short: 'definition_short 1',
        location: [{name: 'location1'}],
        name: 'name1',
        files: [{
            media: {
                name: 'file.pdf',
                length: 1000,
            },
            filemeta: {media_id: 'media1'},
        }],
        links: ['http://www.google.com'],
        _plannings: [],
    };

    const mountForm = (recEvent) => (mount(
        <RepeatEventSummary schedule={recEvent.dates} />
    ));

    it('Shows appropriate repeat summary for a given frequency with intervals', () => {
        const recEvent = {
            ...event,
            dates: {
                start: moment('2016-10-15T14:30'),
                end: moment('2016-10-20T15:00'),
                recurring_rule: {
                    frequency: 'MONTHLY',
                    interval: 3,
                },
            },
        };
        let wrapper = mountForm(recEvent);

        expect(wrapper.find('p').text()).toBe('Every 3 month(s) on day 15 ');
    });

    it('Shows appropriate repeat summary for a given frequency with intervals and until a date', () => {
        const recEvent = {
            ...event,
            dates: {
                start: moment('2016-10-15T14:30+0000'),
                end: moment('2016-10-20T15:00+0000'),
                recurring_rule: {
                    endRepeatMode: 'until',
                    frequency: 'DAILY',
                    interval: 3,
                    until: moment('2020-07-01T00:00'),
                },
            },
        };
        let wrapper = mountForm(recEvent);

        expect(wrapper.find('p').text()).toBe('Every 3 day(s) until 1 Jul 2020 ');
    });

    it('Shows appropriate repeat summary for a given frequency with intervals and for a number of occurrences', () => {
        const recEvent = {
            ...event,
            dates: {
                start: moment('2016-10-15T14:30+0000'),
                end: moment('2016-10-20T15:00+0000'),
                recurring_rule: {
                    endRepeatMode: 'count',
                    frequency: 'DAILY',
                    interval: 3,
                    count: '9',
                },
            },
        };
        let wrapper = mountForm(recEvent);

        expect(wrapper.find('p').text()).toBe('Every 3 day(s) for 9 repeats ');
    });

    it('Shows appropriate repeat summary for a given weekly frequency with intervals and by days', () => {
        const recEvent = {
            ...event,
            dates: {
                start: moment('2016-10-15T14:30+0000'),
                end: moment('2016-10-20T15:00+0000'),
                recurring_rule: {
                    frequency: 'WEEKLY',
                    interval: 3,
                    byday: 'TH FR',
                },
            },
        };
        let wrapper = mountForm(recEvent);

        expect(wrapper.find('p').text()).toBe('Every 3 week(s) on Thursday, Friday');
    });
});
