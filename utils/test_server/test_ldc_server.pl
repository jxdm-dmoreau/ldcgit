#!/usr/bin/perl -w

use HTTP::Request::Common;
use LWP::UserAgent;
use JSON;


$HTTP_SERVER         = 'http://192.168.1.6/ldc';
$RPC_PATH            = '/server/';

sub send_json
{
    my ($filename, $json) = @_;
    #print "\n[$filename]\n ==> $json\n";
    my $ua = LWP::UserAgent->new;
    $ret = $ua->request(POST "$HTTP_SERVER"."$RPC_PATH"."$filename", [json   => $json ]);
    if ($ret->is_success) {
        #print "<== ".$ret->content."\n";
	return $ret->content;
    }
    print STDERR $ret->status_line, "\n";
}


sub read_json
{
    my ($filename) = @_;
    open(my $fh, '<', $filename) or die ($!);
    local $/ = undef;
    my $json = <$fh>;
    close($fh);
    return $json;
}

sub test_result
{
    my ($test_name, $r) = @_;

    if (!($r =~ /\{/) && $r != 0) {
        print STDERR "$test_name FAILED $r\n";
        exit 1;
    } else {
        print "$test_name is OK\n";
    }
}

###############################################################################
# OPERAIONS
###############################################################################

# add
my $json = read_json('add_operation.json');
my $json_rcv = send_json 'add_operation.php', $json;
test_result 'add_operation', $json_rcv;
my $tmp = from_json $json_rcv;
my $json_id =  $json_rcv;
my $op_id = $tmp->{'id'};

# update
$json = read_json('update_operation.json');
$json =~ s/ID/$op_id/;
$json_rcv = send_json 'update_operation.php', $json;
test_result 'update_operation', $json_rcv;

# del
$json_rcv = send_json 'del_operation.php', $json_id;
test_result 'del_operation', $json_rcv;

exit 0;



