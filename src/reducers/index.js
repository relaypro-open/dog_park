import { combineReducers } from 'redux';
import { groupsIsLoading, groupsHasErrored, groups } from './groups';
import {
  environmentsIsLoading,
  environmentsHasErrored,
  environments,
  environmentAdd,
} from './environments';
import { selectedTab, scanLocation } from './app';
import { hostsHasErrored, hostsIsLoading, hosts } from './hosts';
import { flanIpsHasErrored, flanIpsIsLoading, flanIps } from './flan_ips';
import { profilesHasErrored, profilesIsLoading, profiles } from './profiles';
import { servicesHasErrored, servicesIsLoading, services } from './services';
import { zonesHasErrored, zonesIsLoading, zones } from './zones';
import { linksHasErrored, linksIsLoading, links } from './links';
import {
  groupHasErrored,
  groupIsLoading,
  group,
  editGroupOpen,
  createGroupHasErrored,
  createGroupIsLoading,
} from './group';

export default combineReducers({
  groupsHasErrored,
  groupsIsLoading,
  groups,
  environmentsHasErrored,
  environmentsIsLoading,
  environmentAdd,
  environments,
  groupHasErrored,
  groupIsLoading,
  group,
  editGroupOpen,
  createGroupHasErrored,
  createGroupIsLoading,
  hostsHasErrored,
  hostsIsLoading,
  hosts,
  flanIpsHasErrored,
  flanIpsIsLoading,
  flanIps,
  profilesHasErrored,
  profilesIsLoading,
  profiles,
  selectedTab,
  scanLocation,
  servicesHasErrored,
  servicesIsLoading,
  services,
  zonesHasErrored,
  zonesIsLoading,
  zones,
  linksHasErrored,
  linksIsLoading,
  links,
});
